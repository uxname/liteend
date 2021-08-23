/* eslint-disable new-cap */
import config from './config/config';
import express from 'express';
import {ApolloError, ApolloServer} from 'apollo-server-express';
import typeDefs from './schema';
import resolvers from './resolver';
import {getLogger} from './tools/Logger';
import rateLimit from 'express-rate-limit';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import costAnalysis from 'graphql-cost-analysis';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import RequestLogger from './tools/RequestLogger';
import StatusCodes from './tools/StatusCodes';
import {AuthUtils, SecureJwtAccount} from './tools/AuthUtils';
import {prisma} from './tools/Prisma';
import packageJson from '../package.json';
import {mocks} from './tools/mocks';
import {
    ApolloServerPluginLandingPageDisabled,
    ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core';
import {AccountStatus} from './generated/graphql_api';
import {GraphQLContext} from './IContext';

const log = getLogger('server');
const app = express();

class CostAnalysisApolloServer extends ApolloServer {
    async createGraphQLServerOptions(req: express.Request, res: express.Response) {
        const options = await super.createGraphQLServerOptions(req, res);

        options.validationRules = options.validationRules ? options.validationRules.slice() : [];
        options.validationRules.push(costAnalysis({
            variables: req.body.variables,
            maximumCost: config.server.costAnalysis.maximumCost,
            defaultCost: config.server.costAnalysis.defaultCost,
            onComplete: (costs: number) => log.trace(`costs: ${costs} (max: ${config.server.costAnalysis.maximumCost})`)
        }));

        return options;
    }
}

const server = new CostAnalysisApolloServer({
    typeDefs,
    resolvers,
    mocks: config.server.graphql.mocksEnabled ? mocks : undefined,
    mockEntireSchema: config.server.graphql.mocksEnabled ? true : undefined,
    introspection: config.server.graphql.introspection,
    debug: config.server.graphql.debug,
    formatError: (err) => {
        log.debug(err);
        return err;
    },
    context: async ({req}): Promise<GraphQLContext> => {
        RequestLogger.logGraphQL(req);
        let account: SecureJwtAccount | null = null;
        const authHeader = req.header('authorization');
        if (authHeader) {
            try {
                account = await AuthUtils.decodeJwtToken(authHeader);
            } catch (e) {
                log.warn('Decode jwt failed:', authHeader);
            }
        }

        if (account) {
            const accountDb = await prisma.account.findFirst({where: {id: account.id}});
            if (!accountDb) {
                throw new ApolloError('Account not found', String(StatusCodes.NOT_FOUND));
            }
            if (accountDb.status !== AccountStatus.Active) {
                throw new ApolloError(`Account not active. Current account status: ${accountDb.status}`, String(StatusCodes.METHOD_NOT_ALLOWED));
            }
        }

        return {prisma, account};
    },
    plugins: [
        config.server.graphql.playground
            ? ApolloServerPluginLandingPageGraphQLPlayground({
                settings: {
                    'tracing.hideTracingResponse': !config.server.graphql.debug,
                    'queryPlan.hideQueryPlanResponse': !config.server.graphql.debug,
                    'editor.theme': 'light'
                }
            })
            : ApolloServerPluginLandingPageDisabled(),
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        config.server.graphql.tracing ? require('apollo-tracing').plugin() : {}
    ]
});

app.use(RequestLogger.logHttp);
app.use(rateLimit(config.server.rateLimit));
app.use(compression(config.server.compression));
if (config.server.corsEnabled) {
    app.use(cors());
}

app.use(helmet({contentSecurityPolicy: false}));
app.use((req, res, next) => {
    if (!config.server.maintenanceMode.maintenanceModeEnabled) {
        next();
        return;
    }
    const ip: string = req.socket.remoteAddress || 'unknown';

    if (config.server.maintenanceMode.allowedHosts.indexOf(ip) >= 0) {
        log.info(`Maintenance mode enabled. Disable it in config. Got request from: [${ip}]`);
        next();
    } else {
        res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
            status: config.server.maintenanceMode.message
        });
    }
});

async function main() {
    await server.start();
    server.applyMiddleware({app, path: config.server.graphql.path});

    app.listen({port: config.server.port}, () => {
        log.info(`*** ${packageJson.name} ready at http://0.0.0.0:${config.server.port}${server.graphqlPath} ***`);
    });
}

main();
