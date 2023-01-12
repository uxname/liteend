import { Field, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export abstract class Node {
  @Field()
  id: number;
  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;
}
