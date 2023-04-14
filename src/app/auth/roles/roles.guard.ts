import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { WsException } from '@nestjs/websockets';

import { AccountRole } from '@/@generated/nestgraphql/prisma/account-role.enum';
import { GqlContext } from '@/app/gql-context';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly allowedRoles: AccountRole[]) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isWs = context.getType() === 'ws';
    if (isWs) {
      const { accountSession } = context.switchToWs().getClient().data;
      if (accountSession) {
        return true;
      } else {
        throw new WsException('Unauthorized');
      }
    }

    const gqlContext = GqlExecutionContext.create(context);
    if (gqlContext.getContext<GqlContext>().account) {
      const accountRoles = gqlContext.getContext<GqlContext>().account
        ?.roles as AccountRole[] | undefined;
      if (accountRoles) {
        const hasRole = this.allowedRoles.some((role) =>
          accountRoles?.includes(role),
        );
        if (hasRole) {
          return true;
        } else {
          throw new HttpException(
            `Your roles (${accountRoles.join(
              ', ',
            )}) are not: ${this.allowedRoles.join(', ')}`,
            HttpStatus.UNAUTHORIZED,
          );
        }
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
