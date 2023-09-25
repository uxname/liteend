import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { I18n, I18nContext } from 'nestjs-i18n';

import { I18nTranslations } from '@/@generated/i18n-types';
import { Account } from '@/@generated/nestgraphql/account/account.model';
import { AccountStatus } from '@/@generated/nestgraphql/prisma/account-status.enum';
import { ProfileRole } from '@/@generated/nestgraphql/prisma/profile-role.enum';
import { AccountService } from '@/app/account/account.service';
import { AuthResponse, GenerateEmailCodeResponse } from '@/app/account/types';
import { AccountSessionService } from '@/app/account-session/account-session.service';
import { AuthService } from '@/app/auth/auth.service';
import { AuthGuard } from '@/app/auth/auth-guard/auth.guard';
import { RequestContext } from '@/app/auth/request-context-extractor/interfaces';
import { RolesGuard } from '@/app/auth/roles-guard/roles.guard';
import {
  ActivateAccountInput,
  EmailPasswordInput,
  GenerateEmailCodeInput,
  ResetPasswordInput,
} from '@/app/auth/types';
import { EmailService } from '@/app/email/email.service';
import { OneTimeCodeService } from '@/app/one-time-code/one-time-code.service';
import { RequestContextDecorator } from '@/app/request-context.decorator';
import {
  CryptoService,
  RandomStringPrefix,
} from '@/common/crypto/crypto.service';
import { RealIp } from '@/common/real-ip/real-ip.decorator';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
    private readonly accountSessionService: AccountSessionService,
    private readonly cryptoService: CryptoService,
    private readonly oneTimeCodeService: OneTimeCodeService,
    private readonly emailService: EmailService,
  ) {}

  @Mutation(() => AuthResponse)
  async register(
    @Args('data', {
      type: () => EmailPasswordInput,
    })
    data: EmailPasswordInput,
    @Context() context: RequestContext,
    @RealIp() ip: string,
  ): Promise<AuthResponse> {
    const account = await this.accountService.createAccount(
      data.email,
      data.password,
      AccountStatus.INACTIVE,
    );
    const token = await this.cryptoService.generateRandomString(
      RandomStringPrefix.ACCESS_TOKEN,
    );
    await this.accountSessionService.createAccountSession(
      account.id,
      token,
      ip,
      // eslint-disable-next-line sonarjs/no-duplicate-string
      context.req.headers['user-agent'],
    );
    return {
      token,
      account,
    };
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args('data', {
      type: () => EmailPasswordInput,
    })
    data: EmailPasswordInput,
    @Context() context: RequestContext,
    @RealIp() ip: string,
  ): Promise<AuthResponse> {
    const account = await this.authService.validateAccountPassword(
      data.email,
      data.password,
    );
    const token = await this.cryptoService.generateRandomString(
      RandomStringPrefix.ACCESS_TOKEN,
    );

    await this.accountSessionService.createAccountSession(
      account.id,
      token,
      ip,
      context.req.headers['user-agent'],
    );
    return {
      token,
      account,
    };
  }

  @UseGuards(new RolesGuard([ProfileRole.ADMIN]))
  @Mutation(() => AuthResponse)
  async loginAs(
    @Args('email') email: string,
    @Context() context: RequestContext,
    @RealIp() ip: string,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<AuthResponse> {
    const account = await this.accountService.getAccountByEmail(email);
    if (!account) {
      throw new Error(i18n.t('errors.accountNotFound'));
    }

    const token = await this.cryptoService.generateRandomString(
      RandomStringPrefix.ACCESS_TOKEN,
    );

    await this.accountSessionService.createAccountSession(
      account.id,
      token,
      ip,
      context.req.headers['user-agent'],
    );
    return {
      token,
      account,
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(new AuthGuard())
  async logout(
    @Args('sessionIds', {
      type: () => [Number],
    })
    sessionIds: number[],
    @RequestContextDecorator() context: RequestContext,
  ): Promise<boolean> {
    return await this.accountSessionService.deleteSessions(
      // Should be because AuthGuard is used
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      context.account!,
      sessionIds,
    );
  }

  @Mutation(() => Account)
  @UseGuards(new AuthGuard())
  async changePassword(
    @Args('password') password: string,
    @Args('newPassword') newPassword: string,
    @RequestContextDecorator() context: RequestContext,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<Account> {
    const isOldPasswordValid = await this.authService.validateAccountPassword(
      // Should be because AuthGuard is used
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      context.account!.email,
      password,
    );

    if (!isOldPasswordValid) {
      throw new Error(i18n.t('errors.invalidPassword'));
    }

    return await this.accountService.changePassword(
      // Should be because AuthGuard is used
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      context.account!.email,
      newPassword,
    );
  }

  @Mutation(() => GenerateEmailCodeResponse)
  async generateEmailCode(
    @Args('data', { type: () => GenerateEmailCodeInput })
    data: GenerateEmailCodeInput,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<GenerateEmailCodeResponse> {
    const result = await this.oneTimeCodeService.createOneTimeCode(data.email);
    const sendEmailResult = await this.emailService.sendEmail(
      data.email,
      'Activation code',
      `Your activation code is: ${result.code}`,
    );

    if (sendEmailResult) {
      return {
        result: true,
        expiresAt: result.expiresAt,
      };
    } else {
      throw new Error(i18n.t('errors.emailNotSent'));
    }
  }

  @Mutation(() => Account)
  async activateAccount(
    @Args('data', { type: () => ActivateAccountInput })
    data: ActivateAccountInput,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<Account> {
    const isCodeValid = await this.oneTimeCodeService.validateOneTimeCode(
      data.email,
      data.code,
    );
    if (isCodeValid) {
      await this.oneTimeCodeService.deleteOneTimeCode(data.email);
      return await this.accountService.changeStatus(
        data.email,
        AccountStatus.ACTIVE,
      );
    } else {
      throw new Error(i18n.t('errors.invalidCode'));
    }
  }

  @Mutation(() => Account)
  async resetPassword(
    @Args('data', { type: () => ResetPasswordInput })
    data: ResetPasswordInput,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<Account> {
    const isOneTimeCodeValid =
      await this.oneTimeCodeService.validateOneTimeCode(
        data.email,
        data.emailCode,
      );

    if (isOneTimeCodeValid) {
      await this.oneTimeCodeService.deleteOneTimeCode(data.email);
      return await this.accountService.changePassword(
        data.email,
        data.newPassword,
      );
    } else {
      throw new Error(i18n.t('errors.invalidCode'));
    }
  }
}
