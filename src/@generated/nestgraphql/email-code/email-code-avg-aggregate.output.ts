import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Float } from '@nestjs/graphql';

@ObjectType()
export class EmailCodeAvgAggregate {

    @Field(() => Float, {nullable:true})
    id?: number;
}
