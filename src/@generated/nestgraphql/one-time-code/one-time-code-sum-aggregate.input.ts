import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';

@InputType()
export class OneTimeCodeSumAggregateInput {

    @Field(() => Boolean, {nullable:true})
    id?: true;
}
