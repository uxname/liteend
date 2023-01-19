import { AccountSession } from '@/@generated/nestgraphql/account-session/account-session.model';
import { Query, Resolver } from '@nestjs/graphql';
import { Account } from '@/@generated/nestgraphql/account/account.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/graphql/auth/roles/auth.guard';
import { AccountExtractorGuard } from '@/graphql/auth/account-extractor/account-extractor.guard';
import { ContextDecorator } from '@/graphql/context.decorator';
import { GqlContext } from '@/graphql/graphql.module';

@Resolver()
export class AccountResolver {
  @Query(() => [AccountSession], { name: 'sessions' })
  sessions(): AccountSession[] {
    return [] as AccountSession[];
  }

  @Query(() => Account, { name: 'whoami' })
  @UseGuards(AccountExtractorGuard, AuthGuard)
  whoami(@ContextDecorator() account: Account): Account {
    return account;
  }

  @Query(() => AccountSession, { name: 'currentSession' })
  @UseGuards(AccountExtractorGuard, AuthGuard)
  currentSession(@ContextDecorator() context: GqlContext): AccountSession {
    // Should be because AuthGuard is used
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return context.accountSession!;
  }
}
