import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Account } from '@/app/account/types';

@ObjectType()
export class AccountSession {
  @Field(() => Int, { nullable: false })
  id!: number;

  @Field(() => Date, { nullable: false })
  createdAt!: Date;

  @Field(() => Date, { nullable: false })
  updatedAt!: Date;

  @Field(() => Int, { nullable: false })
  accountId!: number;

  @Field(() => String, { nullable: false })
  ipAddr!: string;

  @Field(() => String, { nullable: true })
  userAgent!: string | null;

  @Field(() => Date, { nullable: false })
  expiresAt!: Date;

  @Field(() => Account, { nullable: false })
  account?: Account;
}
