import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { GqlContext } from '@/app/graphql/graphql.module';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    if (gqlContext.getContext<GqlContext>().account) {
      return true;
    } else {
      throw new Error('Unauthorized');
    }
  }
}
