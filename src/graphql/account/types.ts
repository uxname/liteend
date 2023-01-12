import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Node } from '@/graphql/types';

@ObjectType()
export class AuthResponse {
  @Field()
  token!: string;
}

@ObjectType()
export class GenerateEmailCodeResponse {
  @Field()
  result!: boolean;
  @Field()
  expiresAt!: Date;
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

registerEnumType(AccountStatus, { name: 'AccountStatus' });

export enum AccountRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

registerEnumType(AccountRole, { name: 'AccountRole' });

@ObjectType({
  implements: () => [Node],
})
export class Account implements Node {
  @Field() id!: number;
  @Field() createdAt!: Date;
  @Field() updatedAt!: Date;
  @Field() email!: string;
  @Field() status!: AccountStatus;
  @Field(() => [AccountRole]) roles!: AccountRole[];
  @Field(() => [AccountRole]) sessions!: AccountSession[];
}

@ObjectType({
  implements: () => [Node],
})
export class AccountSession implements Node {
  @Field() id!: number;
  @Field() createdAt!: Date;
  @Field() updatedAt!: Date;
  @Field() account!: Account;
  @Field() ipAddr!: string;
  @Field() address!: string;
  @Field() expiresAt!: Date;
}
