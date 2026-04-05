import { Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class JwtOptionalAuthGuard extends JwtAuthGuard {
  // biome-ignore lint/suspicious/noExplicitAny: Required to match base class generic signature — returning user as-is preserves `any` type, compatible with TUser
  handleRequest(err: any, user: any) {
    if (err || !user) {
      return null;
    }
    return user;
  }
}
