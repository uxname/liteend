import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

@ObjectType()
export class Account {
  @Field(() => Int, { nullable: false })
  id!: number;

  @Field(() => Date, { nullable: false })
  createdAt!: Date;

  @Field(() => Date, { nullable: false })
  updatedAt!: Date;

  @Field(() => String, { nullable: false })
  email!: string;

  @Field(() => Int, { nullable: true })
  profileId!: number | null;
}

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

@InputType()
export class UpdateAccountInput {
  @Field()
  avatarUrl: string;
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

registerEnumType(AccountStatus, {
  name: 'AccountStatus',
  description: undefined,
});
