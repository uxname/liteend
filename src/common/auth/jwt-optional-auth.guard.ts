import { Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class JwtOptionalAuthGuard extends JwtAuthGuard {
  // biome-ignore lint/suspicious/noExplicitAny: Override handleRequest to prevent throwing UnauthorizedException
  handleRequest(err: any, user: any) {
    // If there is an error (e.g. invalid token) or no user, just return null.
    // Do not throw an exception.
    if (err || !user) {
      return null;
    }
    return user;
  }
}
