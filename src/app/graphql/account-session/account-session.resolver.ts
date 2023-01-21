import { UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { Account } from '@/@generated/nestgraphql/account/account.model';
import { AccountSession } from '@/@generated/nestgraphql/account-session/account-session.model';
import { AccountExtractorGuard } from '@/app/graphql/auth/account-extractor/account-extractor.guard';
import { AuthGuard } from '@/app/graphql/auth/roles/auth.guard';
import { ContextDecorator } from '@/app/graphql/context.decorator';
import { GqlContext } from '@/app/graphql/graphql.module';

import { AccountSessionService } from './account-session.service';

@Resolver(() => AccountSession)
export class AccountSessionResolver {
  constructor(private readonly accountSessionService: AccountSessionService) {}

  @Query(() => AccountSession, { name: 'currentSession' })
  @UseGuards(AccountExtractorGuard, AuthGuard)
  currentSession(@ContextDecorator() context: GqlContext): AccountSession {
    // Should be because AuthGuard is used
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return context.accountSession!;
  }

  // Resolver for AccountSession.Account
  @ResolveField(() => Account)
  @UseGuards(AccountExtractorGuard, AuthGuard)
  async account(@Parent() accountSession: AccountSession): Promise<Account> {
    return this.accountSessionService.getAccount(accountSession);
  }
}
