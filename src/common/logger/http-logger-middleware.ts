import { Injectable, NestMiddleware } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { NextHandleFunction } from 'connect';
import { NextFunction, Request, Response } from 'express';

import { Logger } from '@/common/logger/logger';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly jsonParser: NextHandleFunction = bodyParser.json();
  private readonly logger: Logger = new Logger(HttpLoggerMiddleware.name);

  minifyGraphqlQuery(query: string): string {
    const commentRegex = /#[^\n\r]*(\r?\n|$)/g;
    const whitespaceRegex = /\s+/g;
    const queryWithoutComments = query.replace(commentRegex, '');
    const queryWithoutParameters = queryWithoutComments.replace(
      /\([\S\s]*?\)/g,
      '',
    );
    return queryWithoutParameters.replace(whitespaceRegex, ' ');
  }

  use(request: Request, response: Response, next: NextFunction) {
    const now = Date.now();
    const xRealIp = request.headers['x-real-ip'];
    const xForwardedFor = request.headers['x-forwarded-for'];
    const requesterIp =
      xRealIp || xForwardedFor || request.socket.remoteAddress;

    const log = () => {
      const elapsedTime = Date.now() - now;
      let logMessage = `[HTTP] ${request.method} ${request.originalUrl} ${response.statusCode} ${requesterIp} [${elapsedTime}ms]`;

      // Если есть GraphQL-запрос или мутация, то логируем их
      if (
        request.method === 'POST' &&
        request.body &&
        (request.body.query || request.body.mutation)
      ) {
        let graphqlQuery = request.body.query || request.body.mutation;
        graphqlQuery = this.minifyGraphqlQuery(graphqlQuery);
        // remove introspection queries from playground
        if (graphqlQuery.includes('IntrospectionQuery')) {
          return;
        }
        logMessage += ` [GraphQL]: ${graphqlQuery}`;
      }

      this.logger.debug(logMessage);
    };

    response.on('finish', () => {
      try {
        log();
      } catch (error) {
        this.logger.error(error);
      }
    });

    this.jsonParser(request, response, () => {
      next();
    });
  }
}
