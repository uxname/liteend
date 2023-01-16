import { Field, ObjectType } from '@nestjs/graphql';
import { Account } from '@/@generated/nestgraphql/account/account.model';

@ObjectType()
export class AuthResponse {
  @Field()
  token: string;

  @Field(() => Account)
  account: Account;
}

@ObjectType()
export class GenerateEmailCodeResponse {
  @Field()
  result: boolean;
  @Field()
  expiresAt: Date;
}
