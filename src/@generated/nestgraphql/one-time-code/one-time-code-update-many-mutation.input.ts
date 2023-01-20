import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';

@InputType()
export class OneTimeCodeUpdateManyMutationInput {

    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;

    @Field(() => String, {nullable:true})
    email?: string;

    @Field(() => String, {nullable:true})
    code?: string;

    @Field(() => Date, {nullable:true})
    expiresAt?: Date | string;
}
