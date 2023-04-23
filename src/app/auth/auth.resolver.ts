import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Account } from '@/@generated/nestgraphql/account/account.model';
import { AccountRole } from '@/@generated/nestgraphql/prisma/account-role.enum';
import { AccountStatus } from '@/@generated/nestgraphql/prisma/account-status.enum';
import { AccountService } from '@/app/account/account.service';
import { AuthResponse, GenerateEmailCodeResponse } from '@/app/account/types';
import { AccountSessionService } from '@/app/account-session/account-session.service';
import { AuthService } from '@/app/auth/auth.service';
import { AuthGuard } from '@/app/auth/auth-guard/auth.guard';
import { RequestContext } from '@/app/auth/request-context-extractor/interfaces';
import { RolesGuard } from '@/app/auth/roles-guard/roles.guard';
import { EmailService } from '@/app/email/email.service';
import { OneTimeCodeService } from '@/app/one-time-code/one-time-code.service';
import { RequestContextDecorator } from '@/app/request-context.decorator';
import {
  CryptoService,
  RandomStringType,
} from '@/common/crypto/crypto.service';
import { RealIp } from '@/common/real-ip/real-ip.decorator';

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
    @Context() context: RequestContext,
    @RealIp() ip: string,
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
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context: RequestContext,
    @RealIp() ip: string,
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
      ip,
      context.req.headers['user-agent'],
    );
    return {
      token,
      account,
    };
  }

  @UseGuards(new RolesGuard([AccountRole.ADMIN]))
  @Mutation(() => AuthResponse)
  async loginAs(
    @Args('email') email: string,
    @Context() context: RequestContext,
    @RealIp() ip: string,
  ) {
    const account = await this.accountService.getAccountByEmail(email);
    if (!account) {
      throw new Error('Account not found');
    }

    const token = await this.cryptoService.generateRandomString(
      RandomStringType.ACCESS_TOKEN,
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
