import { Field, ObjectType } from '@nestjs/graphql';

import { Account } from '@/app/account/types/account.object-type';

@ObjectType()
export class AuthResponse {
  @Field()
  token: string;

  @Field(() => Account)
  account: Account;
}
