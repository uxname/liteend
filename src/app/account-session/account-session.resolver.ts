import { UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Account } from '@/app/account/types/account.object-type';
import { AccountSession } from '@/app/account-session/types/account-session.object-type';
import { AuthGuard } from '@/app/auth/auth-guard/auth.guard';
import { RequestContext } from '@/app/auth/request-context-extractor/interfaces';
import { RequestContextDecorator } from '@/app/request-context.decorator';

import { AccountSessionService } from './account-session.service';

@Resolver(() => AccountSession)
export class AccountSessionResolver {
  constructor(private readonly accountSessionService: AccountSessionService) {}

  @Query(() => AccountSession, { name: 'currentSession' })
  @UseGuards(AuthGuard)
  currentSession(
    @RequestContextDecorator() context: RequestContext,
  ): AccountSession {
    // Since AuthGuard ensures the context.accountSession exists, non-null assertion is safe here
    return context.accountSession!;
  }

  // Resolver for AccountSession.Account
  @ResolveField(() => Account)
  @UseGuards(AuthGuard)
  async account(@Parent() accountSession: AccountSession): Promise<Account> {
    return this.accountSessionService.getAccount(accountSession.id);
  }
}
