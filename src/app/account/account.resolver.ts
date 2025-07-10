import { UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AccountService } from '@/app/account/account.service';
import { Account } from '@/app/account/types/account.object-type';
import { AccountSessionService } from '@/app/account-session/account-session.service';
import { AccountSession } from '@/app/account-session/types/account-session.object-type';
import { AuthGuard } from '@/app/auth/auth-guard/auth.guard';
import { RequestContext } from '@/app/auth/request-context-extractor/interfaces';
import { Profile } from '@/app/profile/types/profile.object-type';
import { RequestContextDecorator } from '@/app/request-context.decorator';

@Resolver(() => Account)
export class AccountResolver {
  constructor(
    private readonly accountSessionService: AccountSessionService,
    private readonly accountService: AccountService,
  ) {}

  @Query(() => Account, { name: 'whoami' })
  @UseGuards(AuthGuard)
  whoami(@RequestContextDecorator() context: RequestContext): Account {
    // Since AuthGuard ensures the context.account exists, non-null assertion is safe here
    return context.account!;
  }

  @ResolveField(() => [AccountSession])
  @UseGuards(AuthGuard)
  async sessions(
    @Parent() account: Account,
    @RequestContextDecorator() context: RequestContext,
    @I18n() i18n: I18nContext,
  ): Promise<AccountSession[]> {
    if (!this.isAuthorizedAccount(context, account)) {
      throw new Error(i18n.t('errors.unauthorized'));
    }
    return this.accountSessionService.getSessions(account.id);
  }

  @ResolveField(() => Profile)
  @UseGuards(AuthGuard)
  async profile(
    @Parent() account: Account,
    @RequestContextDecorator() context: RequestContext,
    @I18n() i18n: I18nContext,
  ): Promise<Profile> {
    if (!this.isAuthorizedAccount(context, account)) {
      throw new Error(i18n.t('errors.unauthorized'));
    }
    return this.accountService.getProfile(account.id);
  }

  private isAuthorizedAccount(
    context: RequestContext,
    account: Account,
  ): boolean {
    return context.account?.id === account.id;
  }
}
