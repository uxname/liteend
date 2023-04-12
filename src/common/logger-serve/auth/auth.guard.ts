import process from 'node:process';

import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const PREFIX = 'Basic ';
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith(PREFIX)) {
      response.setHeader(
        'WWW-Authenticate',
        'Basic realm="Authorization required"',
      );
      response.status(HttpStatus.UNAUTHORIZED).send('Unauthorized');
      return false;
    }

    const credentials = authHeader.slice(PREFIX.length);
    const decoded = Buffer.from(credentials, 'base64').toString('utf8');
    const [username, password] = decoded.split(':');

    if (
      username === process.env.LOGS_ADMIN_PANEL_USER &&
      password === process.env.LOGS_ADMIN_PANEL_PASSWORD
    ) {
      return true;
    }

    response.setHeader(
      'WWW-Authenticate',
      'Basic realm="Authorization required"',
    );

    const PREVENT_BRUTE_FORCE_DELAY = 3000;
    await new Promise((resolve) =>
      setTimeout(resolve, PREVENT_BRUTE_FORCE_DELAY),
    );

    response.status(HttpStatus.UNAUTHORIZED).send('Unauthorized');
    return false;
  }
}
