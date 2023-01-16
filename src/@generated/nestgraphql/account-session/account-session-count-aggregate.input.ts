import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';

@InputType()
export class AccountSessionCountAggregateInput {

    @Field(() => Boolean, {nullable:true})
    id?: true;

    @Field(() => Boolean, {nullable:true})
    createdAt?: true;

    @Field(() => Boolean, {nullable:true})
    updatedAt?: true;

    @Field(() => Boolean, {nullable:true})
    accountId?: true;

    @Field(() => Boolean, {nullable:true})
    token?: true;

    @Field(() => Boolean, {nullable:true})
    ipAddr?: true;

    @Field(() => Boolean, {nullable:true})
    userAgent?: true;

    @Field(() => Boolean, {nullable:true})
    expiresAt?: true;

    @Field(() => Boolean, {nullable:true})
    _all?: true;
}
