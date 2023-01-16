import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';

@InputType()
export class OneTimeCodeAvgAggregateInput {

    @Field(() => Boolean, {nullable:true})
    id?: true;
}
