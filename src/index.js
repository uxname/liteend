const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const typeDefs = require("./schema");
const resolvers = require("./resolver");
const log = require('./tools/Logger').getLogger('server');
const rateLimit = require("express-rate-limit");
const config = require('./config/config');
const app = express();
const costAnalysis = require('graphql-cost-analysis').default;
const GraphqlRequestLogger = require('./tools/GraphqlRequestLogger');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const Datastore = require('nedb-promises');
const db = Datastore.create('./data.db');

class CostAnalysisApolloServer extends ApolloServer {
    async createGraphQLServerOptions(req, res) {
        const options = await super.createGraphQLServerOptions(req, res);

        options.validationRules = options.validationRules ? options.validationRules.slice() : [];
        options.validationRules.push(costAnalysis({
            variables: req.body.variables,
            maximumCost: config.cost_analysis.maximumCost,
            defaultCost: config.cost_analysis.defaultCost,
            onComplete: (costs) => log.trace(`costs: ${costs} (max: ${config.cost_analysis.maximumCost})`)
        }));

        return options;
    }
}

const server = new CostAnalysisApolloServer({
    typeDefs,
    resolvers,
    tracing: config.graphql.tracing,
    mockEntireSchema: undefined,
    introspection: config.graphql.introspection,
    playground: config.graphql.playground,
    debug: config.graphql.debug,
    context: async ({req}) => {
        GraphqlRequestLogger.log(req);
        return {
            db: db
        }
    }
});

app.use(rateLimit(config.rate_limit));
app.use(compression(config.compression));
if (config.cors_enabled === true) app.use(cors());
app.use(helmet());
app.use((req, res, next) => {
    if (!config.maintenance_mode.maintenance_mode_enabled) {
        next();
        return;
    }
    const ip = req.connection.remoteAddress;

    if (config.maintenance_mode.allowed_hosts.indexOf(ip) >= 0) {
        log.info(`Maintenance mode enabled. Disable it in config. Got request from: [${ip}]`);
        next();
    } else {
        res.status(503).json({
            status: config.maintenance_mode.message
        });
    }
});

server.applyMiddleware({app, path: config.graphql.path});

app.listen({port: config.port}, () => {
    log.info(`🚀 Server ready at http://0.0.0.0:${config.port}${server.graphqlPath}`)
});
