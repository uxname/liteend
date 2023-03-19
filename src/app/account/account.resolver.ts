import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { Account } from '@/@generated/nestgraphql/account/account.model';
import { AccountSession } from '@/@generated/nestgraphql/account-session/account-session.model';
import { AccountService } from '@/app/account/account.service';
import { UpdateAccountInput } from '@/app/account/types';
import { AccountSessionService } from '@/app/account-session/account-session.service';
import { AccountExtractorGuard } from '@/app/auth/account-extractor/account-extractor.guard';
import { AuthGuard } from '@/app/auth/roles/auth.guard';
import { ContextDecorator } from '@/app/context.decorator';
import { GqlContext } from '@/app/gql-context';

@Resolver(() => Account)
export class AccountResolver {
  constructor(
    private accountSessionService: AccountSessionService,
    private accountService: AccountService,
  ) {}

  @Query(() => Account, { name: 'whoami' })
  @UseGuards(AccountExtractorGuard, AuthGuard)
  whoami(@ContextDecorator() context: GqlContext): Account {
    // Should be because AuthGuard is used
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return context.account!;
  }

  @ResolveField(() => [AccountSession])
  @UseGuards(AccountExtractorGuard, AuthGuard)
  async sessions(
    @Parent() account: Account,
    @ContextDecorator() context: GqlContext,
  ): Promise<Array<AccountSession>> {
    if (context.account?.id !== account.id) {
      throw new Error('Unauthorized');
    }
    return this.accountSessionService.getSessions(account);
  }

  // update account mutation
  @Mutation(() => Account)
  @UseGuards(AccountExtractorGuard, AuthGuard)
  async updateAccount(
    @ContextDecorator() context: GqlContext,
    @Args('input') input: UpdateAccountInput,
  ): Promise<Account> {
    // Should be because AuthGuard is used
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.accountService.updateAccount(context.account!, input);
  }
}
