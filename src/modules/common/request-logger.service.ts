/* eslint-disable no-magic-numbers */
import {getLogger} from './logger.service';
import express, {RequestHandler} from 'express';
import {AddressInfo} from 'net';
import {Source} from 'graphql/language/source';

const log = getLogger('graphql_request_logger');

export default class RequestLoggerService {
    public static logGraphQL(httpRequest: express.Request): void {
        function logBody(query: string | Source, isMerged: boolean) {
            const isMergedPrefix = isMerged ? ' (merged request)' : '';
            log.trace(`
::::::::::
:: GraphQL${isMergedPrefix}
${query}
:: Variables
${JSON.stringify(httpRequest.body.variables, null, 2)}
::::::::::`);
        }

        if (Array.isArray(httpRequest.body)) {
            for (const body of httpRequest.body) {
                logBody(body.query, true);
            }
        } else {
            logBody(httpRequest.body.query, false);
        }
    }

    public static logHttp: RequestHandler = (request, _, next) => {
        log.trace(`HTTP: ${request.method} ${request.path} ${(<AddressInfo>request.socket.address()).address} ${request.headers['user-agent']}`);
        next();
    };
}


