import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Account } from '@/@generated/nestgraphql/account/account.model';
import { AccountStatus } from '@/@generated/nestgraphql/prisma/account-status.enum';
import { AccountService } from '@/app/graphql/account/account.service';
import {
  AuthResponse,
  GenerateEmailCodeResponse,
} from '@/app/graphql/account/types';
import { AccountSessionService } from '@/app/graphql/account-session/account-session.service';
import { AccountExtractorGuard } from '@/app/graphql/auth/account-extractor/account-extractor.guard';
import { AuthService } from '@/app/graphql/auth/auth.service';
import { AuthGuard } from '@/app/graphql/auth/roles/auth.guard';
import { ContextDecorator } from '@/app/graphql/context.decorator';
import { EmailService } from '@/app/graphql/email/email.service';
import { GqlContext } from '@/app/graphql/graphql.module';
import { OneTimeCodeService } from '@/app/graphql/one-time-code/one-time-code.service';
import {
  CryptoService,
  RandomStringType,
} from '@/common/crypto/crypto.service';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private accountSessionService: AccountSessionService,
    private cryptoService: CryptoService,
    private oneTimeCodeService: OneTimeCodeService,
    private emailService: EmailService,
  ) {}

  @Mutation(() => AuthResponse)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context: GqlContext,
  ): Promise<AuthResponse> {
    const account = await this.accountService.createAccount(
      email,
      password,
      AccountStatus.INACTIVE,
    );
    const token = await this.cryptoService.generateRandomString(
      RandomStringType.ACCESS_TOKEN,
    );
    await this.accountSessionService.createAccountSession(
      account.id,
      token,
      context.req.ip,
      context.req.headers['user-agent'],
    );
    return {
      token,
      account,
    };
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context: GqlContext,
  ): Promise<AuthResponse> {
    const account = await this.authService.validateAccountPassword(
      email,
      password,
    );
    const token = await this.cryptoService.generateRandomString(
      RandomStringType.ACCESS_TOKEN,
    );

    await this.accountSessionService.createAccountSession(
      account.id,
      token,
      context.req.ip,
      context.req.headers['user-agent'],
    );
    return {
      token,
      account,
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(AccountExtractorGuard, new AuthGuard())
  async logout(
    @Args('sessionIds', {
      type: () => [Number],
    })
    sessionIds: number[],
    @ContextDecorator() context: GqlContext,
  ): Promise<boolean> {
    return await this.accountSessionService.deleteSessions(
      // Should be because AuthGuard is used
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      context.account!,
      sessionIds,
    );
  }

  @Mutation(() => Account)
  @UseGuards(AccountExtractorGuard, new AuthGuard())
  async changePassword(
    @Args('password') password: string,
    @Args('newPassword') newPassword: string,
    @ContextDecorator() context: GqlContext,
  ): Promise<Account> {
    const isOldPasswordValid = await this.authService.validateAccountPassword(
      // Should be because AuthGuard is used
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      context.account!.email,
      password,
    );

    if (!isOldPasswordValid) {
      throw new Error('Invalid password');
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
    @Args('email') email: string,
  ): Promise<GenerateEmailCodeResponse> {
    const result = await this.oneTimeCodeService.createOneTimeCode(email);
    const sendEmailResult = await this.emailService.sendEmail(
      email,
      'Activation code',
      `Your activation code is: ${result.code}`,
    );

    if (sendEmailResult) {
      return {
        result: true,
        expiresAt: result.expiresAt,
      };
    } else {
      throw new Error('Sending email error');
    }
  }

  @Mutation(() => Account)
  async activateAccount(
    @Args('email') email: string,
    @Args('code') code: string,
  ): Promise<Account> {
    const isCodeValid = await this.oneTimeCodeService.validateOneTimeCode(
      email,
      code,
    );
    if (isCodeValid) {
      await this.oneTimeCodeService.deleteOneTimeCode(email);
      return await this.accountService.changeStatus(
        email,
        AccountStatus.ACTIVE,
      );
    } else {
      throw new Error('Invalid code');
    }
  }

  @Mutation(() => Account)
  async resetPassword(
    @Args('email', { type: () => String })
    email: string,
    @Args('emailCode', { type: () => String })
    emailCode: string,
    @Args('newPassword', { type: () => String })
    newPassword: string,
  ): Promise<Account> {
    const isOneTimeCodeValid =
      await this.oneTimeCodeService.validateOneTimeCode(email, emailCode);

    if (isOneTimeCodeValid) {
      await this.oneTimeCodeService.deleteOneTimeCode(email);
      return await this.accountService.changePassword(email, newPassword);
    } else {
      throw new Error('Invalid code');
    }
  }
}
