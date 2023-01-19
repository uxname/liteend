import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AccountService } from '@/graphql/account/account.service';
import { AccountSessionService } from '@/graphql/account-session/account-session.service';
import { CryptoService } from '@/common/crypto/crypto.service';
import { GqlContext } from '@/graphql/graphql.module';
import {
  AuthResponse,
  GenerateEmailCodeResponse,
} from '@/graphql/account/types';
import { Account } from '@/@generated/nestgraphql/account/account.model';
import { AuthService } from '@/graphql/auth/auth.service';
import { UseGuards } from '@nestjs/common';
import { AccountExtractorGuard } from '@/graphql/auth/account-extractor/account-extractor.guard';
import { ContextDecorator } from '@/graphql/context.decorator';
import { AuthGuard } from '@/graphql/auth/roles/auth.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private accountSessionService: AccountSessionService,
    private cryptoService: CryptoService,
  ) {}

  @Mutation(() => AuthResponse)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context: GqlContext,
  ): Promise<AuthResponse> {
    const account = await this.accountService.createAccount(email, password);
    const token = await this.cryptoService.generateRandomString();
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
    const token = await this.cryptoService.generateRandomString();

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
  generateEmailCode(email: string): GenerateEmailCodeResponse {
    console.log(email);
    // todo: implement
    // eslint-disable-next-line sonarjs/no-duplicate-string
    throw new Error('Method not implemented.');
  }

  @Mutation(() => Boolean)
  activateAccount(email: string, code: string): Account {
    console.log(email, code);
    // todo: implement
    throw new Error('Method not implemented.');
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
