import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GenerateEmailCodeResponse {
  @Field()
  result: boolean;
  @Field()
  expiresAt: Date;
}
