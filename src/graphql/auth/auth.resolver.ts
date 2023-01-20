import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Account } from '@/@generated/nestgraphql/account/account.model';
import { AccountStatus } from '@/@generated/nestgraphql/prisma/account-status.enum';
import {
  CryptoService,
  RandomStringType,
} from '@/common/crypto/crypto.service';
import { AccountService } from '@/graphql/account/account.service';
import {
  AuthResponse,
  GenerateEmailCodeResponse,
} from '@/graphql/account/types';
import { AccountSessionService } from '@/graphql/account-session/account-session.service';
import { AccountExtractorGuard } from '@/graphql/auth/account-extractor/account-extractor.guard';
import { AuthService } from '@/graphql/auth/auth.service';
import { AuthGuard } from '@/graphql/auth/roles/auth.guard';
import { ContextDecorator } from '@/graphql/context.decorator';
import { EmailService } from '@/graphql/email/email.service';
import { GqlContext } from '@/graphql/graphql.module';
import { OneTimeCodeService } from '@/graphql/one-time-code/one-time-code.service';

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
    const account = await this.authService.validateAccount(email, password);
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

  @Mutation(() => Boolean)
  @UseGuards(AccountExtractorGuard, new AuthGuard())
  async changePassword(
    @Args('password') password: string,
    @Args('newPassword') newPassword: string,
    @ContextDecorator() context: GqlContext,
  ): Promise<boolean> {
    return await this.accountService.changePassword(
      // Should be because AuthGuard is used
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      context.account!,
      password,
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

  @Mutation(() => Boolean)
  resetPassword(
    @Args('email', { type: () => String })
    email: string,
    @Args('emailCode', { type: () => String })
    emailCode: string,
    @Args('newPassword', { type: () => String })
    newPassword: string,
  ): boolean {
    console.log(email, emailCode, newPassword);
    // todo: implement
    throw new Error('Method not implemented.');
  }
}
