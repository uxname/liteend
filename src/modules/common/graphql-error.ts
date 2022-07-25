import {ApolloError} from 'apollo-server-express';
import config from '../../config/config';

interface GraphQLErrorParams {
    message: string;
    code?: number;
    externalData?: Record<string, unknown>;
    internalData?: Record<string, unknown>
}

export default class GraphQLError extends ApolloError {
    constructor(data: GraphQLErrorParams) {
        const _externalData: Record<string, unknown> = {};

        if (!config.server.graphql.debug) {
            _externalData.stacktrace = new Error().stack;
        }

        _externalData.internalData = data.internalData;
        _externalData.message = data.message;
        _externalData.statusCode = data.code ? String(data.code) : undefined;

        _externalData.response = {
            ...data.externalData
        };
        super(data.message, undefined, _externalData);
    }
}
