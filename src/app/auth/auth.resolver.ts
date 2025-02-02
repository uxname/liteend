import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { I18n, I18nContext } from 'nestjs-i18n';

import { I18nTranslations } from '@/@generated/i18n-types';
import { AccountService } from '@/app/account/account.service';
import { Account } from '@/app/account/types/account.object-type';
import { AccountStatus } from '@/app/account/types/account-status.enum';
import { AccountSessionService } from '@/app/account-session/account-session.service';
import { AuthService } from '@/app/auth/auth.service';
import { AuthGuard } from '@/app/auth/auth-guard/auth.guard';
import { RequestContext } from '@/app/auth/request-context-extractor/interfaces';
import { RolesGuard } from '@/app/auth/roles-guard/roles.guard';
import { ActivateAccountInput } from '@/app/auth/types/activate-account.input';
import { AuthResponse } from '@/app/auth/types/auth-response.object-type';
import { EmailPasswordInput } from '@/app/auth/types/email-password.input';
import { GenerateEmailCodeInput } from '@/app/auth/types/generate-email-code.input';
import { GenerateEmailCodeResponse } from '@/app/auth/types/generate-email-code-response.object-type';
import { ResetPasswordInput } from '@/app/auth/types/reset-password.input';
import { EmailService } from '@/app/email/email.service';
import { OneTimeCodeService } from '@/app/one-time-code/one-time-code.service';
import { ProfileRole } from '@/app/profile/types/profile-role.enum';
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
    @Args('data', { type: () => EmailPasswordInput }) data: EmailPasswordInput,
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
      context.req.headers['user-agent'],
    );
    return { token, account };
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args('data', { type: () => EmailPasswordInput }) data: EmailPasswordInput,
    @Context() context: RequestContext,
    @RealIp() ip: string,
    @Args('totpToken', { nullable: true }) totpToken?: string,
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
      totpToken,
    );
    return { token, account };
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
    return { token, account };
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async logout(
    @Args('sessionIds', { type: () => [Number] }) sessionIds: number[],
    @RequestContextDecorator() context: RequestContext,
  ): Promise<boolean> {
    return this.accountSessionService.deleteSessions(
      context.account!.id,
      sessionIds,
    );
  }

  @Mutation(() => Account)
  @UseGuards(AuthGuard)
  async changePassword(
    @Args('password') password: string,
    @Args('newPassword') newPassword: string,
    @RequestContextDecorator() context: RequestContext,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<Account> {
    const isOldPasswordValid = await this.authService.validateAccountPassword(
      context.account!.email,
      password,
    );
    if (!isOldPasswordValid) {
      throw new Error(i18n.t('errors.invalidPassword'));
    }
    return this.accountService.changePassword(
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
      return { result: true, expiresAt: result.expiresAt };
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
      return this.accountService.changeStatus(data.email, AccountStatus.ACTIVE);
    } else {
      throw new Error(i18n.t('errors.invalidCode'));
    }
  }

  @Mutation(() => Account)
  async resetPassword(
    @Args('data', { type: () => ResetPasswordInput }) data: ResetPasswordInput,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<Account> {
    const isOneTimeCodeValid =
      await this.oneTimeCodeService.validateOneTimeCode(
        data.email,
        data.emailCode,
      );
    if (isOneTimeCodeValid) {
      await this.oneTimeCodeService.deleteOneTimeCode(data.email);
      return this.accountService.changePassword(data.email, data.newPassword);
    } else {
      throw new Error(i18n.t('errors.invalidCode'));
    }
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Args('email') email: string,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<boolean> {
    const result = await this.oneTimeCodeService.createOneTimeCode(email);
    const sendEmailResult = await this.emailService.sendEmail(
      email,
      'Reset password code', // todo i18n
      `Your reset password code is: ${result.code}`, // todo i18n
    );
    if (sendEmailResult) {
      return true;
    } else {
      throw new Error(i18n.t('errors.emailNotSent'));
    }
  }

  @Mutation(() => Account)
  async resetPasswordByCode(
    @Args('email') email: string,
    @Args('code') code: string,
    @Args('newPassword') newPassword: string,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<Account> {
    const isOneTimeCodeValid =
      await this.oneTimeCodeService.validateOneTimeCode(email, code);
    if (isOneTimeCodeValid) {
      await this.oneTimeCodeService.deleteOneTimeCode(email);
      return this.accountService.changePassword(email, newPassword);
    } else {
      throw new Error(i18n.t('errors.invalidCode'));
    }
  }

  @UseGuards(AuthGuard)
  @Query(() => String)
  async generateTotpSecret(
    @RequestContextDecorator() context: RequestContext,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Args('token', { nullable: true }) token?: string,
  ): Promise<string> {
    if (!context.profile) {
      throw new Error(i18n.t('errors.unauthorized'));
    }
    return this.authService.generateTotpSecret(context.profile.id, token);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async changeTotpEnabled(
    @Args('token') token: string,
    @Args('enabled') enabled: boolean,
    @RequestContextDecorator() context: RequestContext,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<boolean> {
    if (!context.profile) {
      throw new Error(i18n.t('errors.unauthorized'));
    }

    return await this.authService.changeTotpEnabled(
      context.profile.id,
      token,
      enabled,
    );
  }
}
