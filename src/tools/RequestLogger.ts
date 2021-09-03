import {getLogger} from './Logger';
import * as graphql from 'graphql';
import express, {RequestHandler} from 'express';
import {AddressInfo} from 'net';
import {Source} from 'graphql/language/source';

const log = getLogger('graphql_request_logger');

export default class RequestLogger {
    public static logGraphQL(httpRequest: express.Request): void {
        function logBody(query: string | Source, isMerged: boolean) {
            const result: string[] = [];
            const request = graphql.parse(query);
            request.definitions.forEach(definition => {
                if ('selectionSet' in definition) {
                    definition.selectionSet.selections.forEach(selection => {
                        if ('name' in selection) {
                            result.push(selection.name.value);
                        }
                    });
                }
            });

            const isMergedPrefix = isMerged ? ' (merged request)' : '';
            log.trace(`GraphQL${isMergedPrefix}: [${result.join(', ')}]`);
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


