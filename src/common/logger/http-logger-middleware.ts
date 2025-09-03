import { Injectable, NestMiddleware } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { Handler, NextFunction, Request, Response } from 'express';

import { Logger } from '@/common/logger/logger';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly jsonParser: Handler = bodyParser.json();
  private readonly logger: Logger = new Logger(HttpLoggerMiddleware.name);

  // Minifies GraphQL query by removing comments and unnecessary whitespace
  private minifyGraphqlQuery(query: string): string {
    return query
      .split('\n')
      .map((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('#')) return '';
        const parametersStart = trimmedLine.indexOf('(');
        if (parametersStart !== -1) {
          const parametersEnd = trimmedLine.indexOf(')');
          return (
            trimmedLine.slice(0, parametersStart) +
            trimmedLine.slice(parametersEnd + 1)
          );
        }
        return trimmedLine;
      })
      .join(' ')
      .replaceAll(/\s+/g, ' ');
  }

  // Main function to log HTTP requests and responses
  use(request: Request, response: Response, next: NextFunction): void {
    const startTime = Date.now();
    const requesterIp =
      request.headers['x-real-ip'] ||
      request.headers['x-forwarded-for'] ||
      request.socket.remoteAddress;

    // Log the HTTP request after response finishes
    const logRequest = (): void => {
      const elapsedTime = Date.now() - startTime;
      let logMessage = `[HTTP] ${request.method} ${request.originalUrl} ${response.statusCode} ${requesterIp} [${elapsedTime}ms]`;

      if (request.method === 'POST' && request.body) {
        const graphqlQuery = request.body.query || request.body.mutation;
        if (graphqlQuery) {
          const minifiedQuery = this.minifyGraphqlQuery(graphqlQuery);
          if (!minifiedQuery.includes('IntrospectionQuery')) {
            logMessage += ` [GraphQL]: ${minifiedQuery}`;
          }
        }
      }

      this.logger.debug(logMessage);
    };

    response.on('finish', () => {
      try {
        logRequest();
      } catch (error) {
        this.logger.error(error);
      }
    });

    this.jsonParser(request, response, () => next());
  }
}
