import process from 'node:process';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule as BullBoard } from '@bull-board/nestjs';
import { HttpStatus, Logger, Module } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

// Instantiate logger with a descriptive name for this module
const logger = new Logger('BullBoardModule');

function createAuthenticationMiddleware(): (
  request: Request,
  response: Response,
  next: NextFunction,
) => void {
  return (request: Request, response: Response, next: NextFunction): void => {
    try {
      const { login, password } = getCredentialsFromEnvironment();

      if (!login || !password) {
        handleAuthError(
          response,
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Authentication credentials are missing in environment variables.',
        );
        return;
      }

      const credentials = extractCredentials(request);
      if (!credentials || !validateCredentials(credentials, login, password)) {
        sendUnauthorizedResponse(response);
        return;
      }

      next(); // Authentication successful
    } catch (error) {
      logger.error('Error in authentication middleware:', error);
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  };
}

function getCredentialsFromEnvironment(): {
  login: string | undefined;
  password: string | undefined;
} {
  return {
    login: process.env.BULL_BOARD_LOGIN,
    password: process.env.BULL_BOARD_PASSWORD,
  };
}

function extractCredentials(
  request: Request,
): { login: string; password: string } | undefined {
  const authorizationHeader = request.headers.authorization ?? '';
  const [authType, credentials] = authorizationHeader.split(' ');

  if (authType !== 'Basic' || !credentials) {
    return undefined;
  }

  const [login, password] = Buffer.from(credentials, 'base64')
    .toString()
    .split(':');

  return login && password ? { login, password } : undefined;
}

function validateCredentials(
  provided: { login: string; password: string },
  expectedLogin: string,
  expectedPassword: string,
): boolean {
  return (
    provided.login === expectedLogin && provided.password === expectedPassword
  );
}

function handleAuthError(
  response: Response,
  status: HttpStatus,
  message: string,
): void {
  logger.error(message);
  response.status(status).send(message);
}

function sendUnauthorizedResponse(response: Response): void {
  response.set('WWW-Authenticate', 'Basic realm="401"');
  response.status(HttpStatus.UNAUTHORIZED).send('Authentication required.');
}

@Module({
  imports: [
    BullBoard.forRoot({
      route: '/board',
      adapter: ExpressAdapter, // Using ExpressAdapter; switch to FastifyAdapter if needed
      middleware: createAuthenticationMiddleware(),
    }),
    // Registering queues with Bull Board
    BullBoard.forFeature({
      name: 'test',
      adapter: BullMQAdapter,
    }),
  ],
})
export class BullBoardModule {}
