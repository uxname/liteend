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
import { AuthGuard } from '@/app/auth/auth-guard/auth.guard';
import { RequestContext } from '@/app/auth/request-context-extractor/interfaces';
import { RequestContextDecorator } from '@/app/request-context.decorator';

@Resolver(() => Account)
export class AccountResolver {
  constructor(
    private accountSessionService: AccountSessionService,
    private accountService: AccountService,
  ) {}

  @Query(() => Account, { name: 'whoami' })
  @UseGuards(AuthGuard)
  whoami(@RequestContextDecorator() context: RequestContext): Account {
    // Should be because AuthGuard is used
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return context.account!;
  }

  @ResolveField(() => [AccountSession])
  @UseGuards(AuthGuard)
  async sessions(
    @Parent() account: Account,
    @RequestContextDecorator() context: RequestContext,
  ): Promise<Array<AccountSession>> {
    if (context.account?.id !== account.id) {
      throw new Error('Unauthorized');
    }
    return this.accountSessionService.getSessions(account);
  }

  // update account mutation
  @Mutation(() => Account)
  @UseGuards(AuthGuard)
  async updateAccount(
    @RequestContextDecorator() context: RequestContext,
    @Args('input') input: UpdateAccountInput,
  ): Promise<Account> {
    // Should be because AuthGuard is used
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.accountService.updateAccount(context.account!, input);
  }
}
