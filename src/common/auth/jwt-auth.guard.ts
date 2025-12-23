import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { ProfileRole } from '@/@generated/prisma/enums';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isMockEnabled =
      this.configService.get<string>('OIDC_MOCK_ENABLED') === 'true';

    if (isMockEnabled) {
      const request = this.getRequest(context);

      request.user = await this.prisma.profile.upsert({
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
      return true;
    }

    return super.canActivate(context) as Promise<boolean>;
  }

  getRequest(context: ExecutionContext) {
    // 1. HTTP REST
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    }
    // 2. GraphQL
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext();

    if (gqlContext.req) {
      return gqlContext.req;
    }

    throw new UnauthorizedException('Cannot determine request context');
  }
}
