import { Field, Int, ObjectType } from '@nestjs/graphql';

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

  @Field(() => String, { nullable: true })
  avatarUrl!: string | null;
}
