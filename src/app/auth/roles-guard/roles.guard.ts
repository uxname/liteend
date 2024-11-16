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
import { RequestContext } from '@/app/auth/request-context-extractor/interfaces';
import { ProfileRole } from '@/app/profile/types/profile-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly allowedRoles: ProfileRole[]) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Allow WebSocket connections without further checks
    if (context.getType() === 'ws') {
      return true;
    }

    const i18n = I18nContext.current<I18nTranslations>();

    if (!i18n) {
      throw new HttpException('i18n not initialized', HttpStatus.FORBIDDEN);
    }

    // Extract GraphQL context and RequestContext
    const gqlContext = GqlExecutionContext.create(context);
    const requestContext: RequestContext | undefined =
      gqlContext.getContext().req.requestContext;

    if (!requestContext?.profile) {
      throw new HttpException(
        i18n.t('errors.unauthorized'),
        HttpStatus.UNAUTHORIZED,
      );
    }

    const profileRoles = requestContext.profile.roles as
      | ProfileRole[]
      | undefined;
    if (!profileRoles) {
      throw new HttpException(
        i18n.t('errors.unauthorized'),
        HttpStatus.UNAUTHORIZED,
      );
    }

    const hasRole = this.allowedRoles.some((role) =>
      profileRoles.includes(role),
    );
    if (hasRole) {
      return true;
    }

    const profileRolesString = profileRoles.join(', ');
    const allowedRolesString = this.allowedRoles.join(', ');
    throw new HttpException(
      i18n.t('errors.accountHasNoRole', {
        args: {
          accountRoles: profileRolesString,
          allowedRoles: allowedRolesString,
        },
      }),
      HttpStatus.UNAUTHORIZED,
    );
  }
}
