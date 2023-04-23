import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AccountStatus } from '@/@generated/nestgraphql/prisma/account-status.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() === 'ws') {
      return true;
    }
    const gqlContext = GqlExecutionContext.create(context);
    const requestContext = gqlContext.getContext().req.requestContext;
    if (requestContext.accountSession) {
      if (
        requestContext.accountSession.account.status !== AccountStatus.ACTIVE
      ) {
        throw new HttpException(
          'Account is not active',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return true;
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
