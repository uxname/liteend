import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import {
  AuthResponse,
  GenerateEmailCodeResponse,
} from '@/graphql/account/types';
import { AccountService } from '@/graphql/account/account.service';
import { AccountSessionService } from '@/graphql/account-session/account-session.service';
import { CryptoService } from '@/common/crypto/crypto.service';
import { Ip } from '@nestjs/common';

@Resolver()
export class MutationResolver {
  constructor(
    private accountService: AccountService,
    private accountSessionService: AccountSessionService,
    private cryptoService: CryptoService,
  ) {}

  // todo add text limit guard
  @Mutation(() => String, { name: 'echo' })
  echo(@Args('text', { type: () => String }) text: string): string {
    return text;
  }

  @Mutation(() => AuthResponse)
  async register(
    email: string,
    password: string,
    @Ip() ipAddr: string,
  ): Promise<AuthResponse> {
    const account = await this.accountService.createAccount(email, password);
    const token = await this.cryptoService.generateRandomString();
    await this.accountSessionService.createAccountSession(
      account.id,
      token,
      ipAddr,
    );
    return {
      token,
      account,
    };
  }

  @Mutation(() => GenerateEmailCodeResponse)
  generateEmailCode(email: string): GenerateEmailCodeResponse {
    console.log(email);
    return {} as GenerateEmailCodeResponse;
  }

  @Mutation(() => Boolean)
  activateAccount(email: string, code: string): boolean {
    console.log(email, code);
    return true;
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
    return true;
  }

  @Mutation(() => AuthResponse)
  login(email: string, password: string): AuthResponse {
    console.log(email, password);
    return {} as AuthResponse;
  }

  @Mutation(() => Boolean)
  logout(sessionIds: number[]): boolean {
    console.log(sessionIds);
    return true;
  }

  @Mutation(() => Boolean)
  changePassword(password: string, newPassword: string): boolean {
    console.log(password, newPassword);
    return true;
  }
}
