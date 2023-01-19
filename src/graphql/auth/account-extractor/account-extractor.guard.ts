import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from '@/graphql/graphql.module';
import { AccountSessionService } from '@/graphql/account-session/account-session.service';

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
    return true;
  }
}