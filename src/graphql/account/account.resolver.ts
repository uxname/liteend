import { AccountSession } from '@/@generated/nestgraphql/account-session/account-session.model';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Account } from '@/@generated/nestgraphql/account/account.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/graphql/auth/roles/auth.guard';
import { AccountExtractorGuard } from '@/graphql/auth/account-extractor/account-extractor.guard';
import { ContextDecorator } from '@/graphql/context.decorator';
import { GqlContext } from '@/graphql/graphql.module';
import { AccountSessionService } from '@/graphql/account-session/account-session.service';

@Resolver(() => Account)
export class AccountResolver {
  constructor(private accountSessionService: AccountSessionService) {}

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
}
