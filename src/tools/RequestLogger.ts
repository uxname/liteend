import {getLogger} from './Logger';
import * as graphql from 'graphql';
import express, {RequestHandler} from 'express';
import {AddressInfo} from 'net';

const log = getLogger('graphql_request_logger');

export default class RequestLogger {
    public static logGraphQL(httpRequest: express.Request): void {
        const result: string[] = [];
        const request = graphql.parse(httpRequest.body.query);
        request.definitions.forEach(definition => {
            if ('selectionSet' in definition) {
                definition.selectionSet.selections.forEach(selection => {
                    if ('name' in selection) {
                        result.push(selection.name.value);
                    }
                });
            }
        });

        log.trace(`GraphQL: [${result.join(', ')}]`);
    }

    public static logHttp: RequestHandler = (request, _, next) => {
        log.trace(`HTTP: ${request.method} ${request.path} ${(<AddressInfo>request.socket.address()).address} ${request.headers['user-agent']}`);
        next();
    };
}


