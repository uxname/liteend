import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
  AuthResponse,
  GenerateEmailCodeResponse,
} from '@/graphql/account/types';

@Resolver()
export class MutationResolver {
  @Mutation(() => String, { name: 'echo' })
  echo(@Args('text', { type: () => String }) text: string): string {
    return text;
  }

  @Mutation(() => AuthResponse)
  register(email: string, password: string): AuthResponse {
    console.log(email, password);
    return {} as AuthResponse;
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
