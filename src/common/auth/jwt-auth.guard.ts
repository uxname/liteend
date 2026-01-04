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
import { ProfileRole } from '@/@generated/prisma/enums';
import { PrismaService } from '@/common/prisma/prisma.service';

interface RequestWithUser {
  user?: Profile;
  raw?: { user?: Profile };
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
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
      const user = await this.prisma.profile.upsert({
        where: { oidcSub: 'mock-oidc-sub' },
        create: {
          oidcSub: 'mock-oidc-sub',
          roles: [ProfileRole.USER, ProfileRole.ADMIN],
          avatarUrl: 'https://i.pravatar.cc/300',
        },
        update: {
          roles: [ProfileRole.USER, ProfileRole.ADMIN],
          avatarUrl: 'https://i.pravatar.cc/300',
        },
      });

      this.syncUser(request, user);
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
