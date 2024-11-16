import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  private sendUnauthorizedResponse(response: Response): void {
    response.setHeader(
      'WWW-Authenticate',
      'Basic realm="Authorization required"',
    );
    response.status(HttpStatus.UNAUTHORIZED).send('Unauthorized');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const PREFIX = 'Basic ';
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith(PREFIX)) {
      this.sendUnauthorizedResponse(response);
      return false;
    }

    const credentials = authHeader.slice(PREFIX.length);
    const decoded = Buffer.from(credentials, 'base64').toString('utf8');
    const [username, password] = decoded.split(':');

    const expectedUsername = this.configService.getOrThrow<string>(
      'LOGS_ADMIN_PANEL_USER',
    );
    const expectedPassword = this.configService.getOrThrow<string>(
      'LOGS_ADMIN_PANEL_PASSWORD',
    );

    if (username === expectedUsername && password === expectedPassword) {
      return true;
    }

    // Delay response to prevent brute force attempts
    const PREVENT_BRUTE_FORCE_DELAY = 3000;
    await new Promise((resolve) =>
      setTimeout(resolve, PREVENT_BRUTE_FORCE_DELAY),
    );

    this.sendUnauthorizedResponse(response);
    return false;
  }
}
