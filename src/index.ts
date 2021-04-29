import config from './config/config';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import typeDefs from './schema';
import resolvers from './resolver';
import {getLogger} from './tools/Logger';
import rateLimit from 'express-rate-limit';
import costAnalysis from 'graphql-cost-analysis';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import GraphqlRequestLogger from './tools/GraphqlRequestLogger';
import StatusCodes from './tools/StatusCodes';
import {AuthUtils, SecureJwtUser} from './tools/AuthUtils';
import {prisma} from './tools/Prisma';

const log = getLogger('server');
const app = express();

class CostAnalysisApolloServer extends ApolloServer {
    async createGraphQLServerOptions(req, res) {
        const options = await super.createGraphQLServerOptions(req, res);

        options.validationRules = options.validationRules ? options.validationRules.slice() : [];
        options.validationRules.push(costAnalysis({
            variables: req.body.variables,
            maximumCost: config.server.costAnalysis.maximumCost,
            defaultCost: config.server.costAnalysis.defaultCost,
            onComplete: (costs) => log.trace(`costs: ${costs} (max: ${config.server.costAnalysis.maximumCost})`)
        }));

        return options;
    }
}

const server = new CostAnalysisApolloServer({
    typeDefs,
    resolvers,
    tracing: config.server.graphql.tracing,
    mockEntireSchema: undefined,
    introspection: config.server.graphql.introspection,
    playground: config.server.graphql.playground,
    debug: config.server.graphql.debug,
    formatError: (err) => {
        log.debug(err);
        return err;
    },
    context: async ({req}) => {
        GraphqlRequestLogger.log(req);
        let user: SecureJwtUser;
        const authHeader = req.header('authorization');
        if (authHeader) {
            try {
                user = await AuthUtils.decodeJwtToken(authHeader);
            } catch (e) {
                log.warn('Decode jwt failed:', authHeader);
            }
        }
        return {prisma, user};
    }
});

app.use(rateLimit(config.server.rateLimit));
app.use(compression(config.server.compression));
if (config.server.corsEnabled === true) {
    app.use(cors());
}
app.use(helmet({contentSecurityPolicy: false}));
app.use((req, res, next) => {
    if (!config.server.maintenanceMode.maintenanceModeEnabled) {
        next();
        return;
    }
    const ip = req.connection.remoteAddress;

    if (config.server.maintenanceMode.allowedHosts.indexOf(ip) >= 0) {
        log.info(`Maintenance mode enabled. Disable it in config. Got request from: [${ip}]`);
        next();
    } else {
        res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
            status: config.server.maintenanceMode.message
        });
    }
});

server.applyMiddleware({app, path: config.server.graphql.path});

app.listen({port: config.server.port}, () => {
    log.info(`🚀 Server ready at http://0.0.0.0:${config.server.port}${server.graphqlPath}`);
});
