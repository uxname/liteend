import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { I18nContext } from 'nestjs-i18n';

import { I18nTranslations } from '@/@generated/i18n-types';
import { AccountRole } from '@/@generated/nestgraphql/prisma/account-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly allowedRoles: AccountRole[]) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() === 'ws') {
      return true;
    }

    const i18n = I18nContext.current<I18nTranslations>();

    if (!i18n) {
      throw new HttpException('i18n not initialized', HttpStatus.FORBIDDEN);
    }

    const gqlContext = GqlExecutionContext.create(context);
    const requestContext = gqlContext.getContext().req.requestContext;
    if (requestContext.account) {
      const accountRoles = requestContext.account.roles as
        | AccountRole[]
        | undefined;
      if (accountRoles) {
        const hasRole = this.allowedRoles.some(
          (role) => accountRoles?.includes(role),
        );
        if (hasRole) {
          return true;
        } else {
          const accountRolesString = accountRoles.join(', ');
          const allowedRolesString = this.allowedRoles.join(', ');
          throw new HttpException(
            i18n.t('errors.accountHasNoRole', {
              args: {
                accountRoles: accountRolesString,
                allowedRoles: allowedRolesString,
              },
            }),
            HttpStatus.UNAUTHORIZED,
          );
        }
      } else {
        throw new HttpException(
          i18n.t('errors.unauthorized'),
          HttpStatus.UNAUTHORIZED,
        );
      }
    } else {
      throw new HttpException(
        i18n.t('errors.unauthorized'),
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
