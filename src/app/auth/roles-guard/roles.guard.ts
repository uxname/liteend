import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AccountRole } from '@/@generated/nestgraphql/prisma/account-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly allowedRoles: AccountRole[]) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() === 'ws') {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);
    const requestContext = gqlContext.getContext().req.requestContext;
    if (requestContext.account) {
      // Получаем данные пользователя из middleware
      const accountRoles = requestContext.account.roles as
        | AccountRole[]
        | undefined;
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
