import { Field, Int, ObjectType } from '@nestjs/graphql';

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
