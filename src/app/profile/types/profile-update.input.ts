import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ProfileUpdateInput {
  @Field(() => String, { nullable: true })
  avatarUrl?: string;
}
