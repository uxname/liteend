import { Field, InputType } from '@nestjs/graphql';

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
