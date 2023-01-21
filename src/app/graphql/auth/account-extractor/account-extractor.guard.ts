import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AccountSessionService } from '@/app/graphql/account-session/account-session.service';
import { GqlContext } from '@/app/graphql/graphql.module';

@Injectable()
export class AccountExtractorGuard implements CanActivate {
  constructor(private accountSessionService?: AccountSessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const token = gqlContext.getContext<GqlContext>().req.headers.authorization;
    if (!token) {
      return true;
    }
    gqlContext.getContext<GqlContext>().account =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await this.accountSessionService!.getAccountByToken(token);

    gqlContext.getContext<GqlContext>().accountSession =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await this.accountSessionService!.getAccountSessionByToken(token);

    return true;
  }
}
