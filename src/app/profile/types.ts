import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import { AccountStatus } from '@/app/account/types';

export enum ProfileRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

registerEnumType(ProfileRole, { name: 'ProfileRole', description: undefined });

@ObjectType()
export class Profile {
  @Field(() => Int, { nullable: false })
  id!: number;

  @Field(() => Date, { nullable: false })
  createdAt!: Date;

  @Field(() => Date, { nullable: false })
  updatedAt!: Date;

  @Field(() => [ProfileRole], { nullable: true })
  roles!: Array<keyof typeof ProfileRole>;

  @Field(() => AccountStatus, { nullable: false })
  status!: keyof typeof AccountStatus;

  @Field(() => String, { nullable: true })
  avatarUrl!: string | null;

  @Field(() => String, { nullable: true })
  name!: string | null;

  @Field(() => String, { nullable: true })
  bio!: string | null;

  @Field(() => Boolean, { nullable: false, defaultValue: false })
  totpEnabled!: boolean;
}

@InputType()
export class ProfileUpdateInput {
  @Field(() => String, { nullable: true })
  avatarUrl?: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  bio?: string;

  @Field(() => Boolean, { nullable: true })
  totpEnabled?: boolean;

  @Field(() => String, { nullable: true })
  totpSecret?: string;
}
