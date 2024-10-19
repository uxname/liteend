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
    const lines = query.split('\n');
    const minifiedLines = lines.map((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('#')) return '';
      const parametersStart = trimmedLine.indexOf('(');
      if (parametersStart !== -1) {
        const parametersEnd = trimmedLine.indexOf(')');
        if (parametersEnd !== -1) {
          return (
            trimmedLine.slice(0, Math.max(0, parametersStart)) +
            trimmedLine.slice(Math.max(0, parametersEnd + 1))
          );
        }
      }
      return trimmedLine;
    });
    return minifiedLines.join(' ').replaceAll(/\s+/g, ' ');
  }

  use(request: Request, response: Response, next: NextFunction): void {
    const now = Date.now();
    const xRealIp = request.headers['x-real-ip'];
    const xForwardedFor = request.headers['x-forwarded-for'];
    const requesterIp =
      xRealIp || xForwardedFor || request.socket.remoteAddress;

    const log = (): void => {
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
