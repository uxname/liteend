import { Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class JwtOptionalAuthGuard extends JwtAuthGuard {
  // biome-ignore lint/suspicious/noExplicitAny: Override handleRequest to prevent throwing UnauthorizedException
  handleRequest(err: any, user: any) {
    if (err || !user) {
      return null;
    }
    return user;
  }
}
