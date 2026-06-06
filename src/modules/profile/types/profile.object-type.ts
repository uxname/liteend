import { Field, Int, ObjectType } from '@nestjs/graphql';

import { ProfileRole } from './profile-role.enum';

@ObjectType({
  description: 'Authenticated user profile linked to an OIDC account',
})
export class Profile {
  @Field(() => Int, {
    nullable: false,
    description: 'Unique profile identifier',
  })
  id!: number;

  @Field(() => Date, {
    nullable: false,
    description: 'Profile creation timestamp',
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false,
    description: 'Profile last update timestamp',
  })
  updatedAt!: Date;

  @Field(() => [ProfileRole], {
    nullable: true,
    description: 'Assigned roles (ADMIN, USER)',
  })
  roles!: Array<keyof typeof ProfileRole>;

  @Field(() => String, { nullable: true, description: 'Avatar image URL' })
  avatarUrl!: string | null;

  @Field(() => String, { nullable: true, description: 'Public display name' })
  displayName!: string | null;

  @Field(() => String, { nullable: true, description: 'Short biography' })
  bio!: string | null;
}
