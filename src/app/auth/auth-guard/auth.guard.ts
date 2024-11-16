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
import { AccountStatus } from '@/app/account/types/account-status.enum';
import { RequestContext } from '@/app/auth/request-context-extractor/interfaces';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const i18n = I18nContext.current<I18nTranslations>();
    if (!i18n) {
      throw new HttpException('i18n not initialized', HttpStatus.FORBIDDEN);
    }

    // Allow WebSocket connections without further checks
    if (context.getType() === 'ws') {
      return true;
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

    // Check if the user's account status is active
    if (requestContext.profile.status !== AccountStatus.ACTIVE) {
      throw new HttpException(
        i18n.t('errors.accountSuspended'),
        HttpStatus.UNAUTHORIZED,
      );
    }

    return true;
  }
}
