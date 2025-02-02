import {
  CanActivate,
  CustomDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { I18nContext } from 'nestjs-i18n';

import { I18nTranslations } from '@/@generated/i18n-types';
import { AccountStatus } from '@/app/account/types/account-status.enum';
import { RequestContext } from '@/app/auth/request-context-extractor/interfaces';

/**
 * Decorator to mark a route as optionally authenticated.
 * Usage:
 * @UseGuards(AuthGuard)
 * @OptionalAuth()
 * @Get()
 * getHello() {}
 */
export const OptionalAuth = (): CustomDecorator<string> =>
  SetMetadata('optionalAuth', true);

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Retrieve the "optionalAuth" metadata
    const optional: boolean | undefined = this.reflector.get<boolean>(
      'optionalAuth',
      context.getHandler(),
    );

    // Get the current i18n context; throw if not initialized
    const i18n = I18nContext.current<I18nTranslations>();
    if (!i18n) {
      throw new HttpException('i18n not initialized', HttpStatus.FORBIDDEN);
    }

    // Allow WebSocket connections without further checks
    if (context.getType() === 'ws') {
      return true;
    }

    // Extract the GraphQL execution context
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext()?.req;
    const requestContext: RequestContext | undefined = request?.requestContext;

    // If authentication is optional, allow the request to proceed
    if (optional) {
      return true;
    }

    // Check if the request contains a valid profile; if not, deny access
    if (!requestContext?.profile) {
      throw new HttpException(
        i18n.t('errors.unauthorized'),
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Verify that the account status is active; if not, deny access
    if (requestContext.profile.status !== AccountStatus.ACTIVE) {
      throw new HttpException(
        i18n.t('errors.accountSuspended'),
        HttpStatus.UNAUTHORIZED,
      );
    }

    return true;
  }
}
