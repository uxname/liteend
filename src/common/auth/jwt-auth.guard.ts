import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { PinoLogger } from 'nestjs-pino';
import { Profile } from '@/@generated/prisma/client';
import { AuthService } from '@/common/auth/auth.service';

interface RequestWithUser {
  user?: Profile;
  raw?: { user?: Profile };
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly logger: PinoLogger,
  ) {
    super();
    this.logger.setContext(JwtAuthGuard.name);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isMockEnabled =
      this.configService.get<string>('OIDC_MOCK_ENABLED') === 'true';
    const request = this.getRequest(context) as RequestWithUser;

    if (isMockEnabled) {
      const mockSub = (
        request as RequestWithUser & { headers?: Record<string, string> }
      ).headers?.['x-mock-sub'];

      if (mockSub) {
        const user = await this.authService.findProfileBySub(mockSub);
        if (user) {
          this.syncUser(request, user);
          return true;
        }
      }

      const defaultUser = await this.authService.findOrCreateDefaultMockUser();

      this.syncUser(request, defaultUser);
      return true;
    }

    const result = await super.canActivate(context);

    if (result && request.user) {
      this.syncUser(request, request.user);
    }

    return result as boolean;
  }

  private syncUser(request: RequestWithUser, user: Profile) {
    request.user = user;
    if (request.raw) {
      request.raw.user = user;
    }
    this.logger.assign({ userId: user.id });
  }

  getRequest(context: ExecutionContext) {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    }
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext();
    if (gqlContext.req) return gqlContext.req;
    throw new UnauthorizedException('Cannot determine request context');
  }
}
