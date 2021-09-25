import {ApolloError} from 'apollo-server-express';
import config from '../config/config';

export default class GraphQLError extends ApolloError {
    constructor({
        message,
        code,
        extension,
        internalData
    }: { message: string, code?: number, extension?: Record<string, unknown>, internalData?: Record<string, unknown> }) {
        const extensionRes = extension || {};

        if (!config.server.graphql.debug) {
            extensionRes.stacktrace = new Error().stack;
        }

        extensionRes.internalData = internalData;
        super(message, code ? String(code) : undefined, extensionRes);
    }
}
