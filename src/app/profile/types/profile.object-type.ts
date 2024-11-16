import { Field, Int, ObjectType } from '@nestjs/graphql';

import { AccountStatus } from '@/app/account/types/account-status.enum';
import { ProfileRole } from '@/app/profile/types/profile-role.enum';

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
