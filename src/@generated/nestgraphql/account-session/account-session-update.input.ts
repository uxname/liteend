import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountUpdateOneRequiredWithoutSessionsNestedInput } from '../account/account-update-one-required-without-sessions-nested.input';

@InputType()
export class AccountSessionUpdateInput {

    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;

    @Field(() => String, {nullable:true})
    token?: string;

    @Field(() => String, {nullable:true})
    ipAddr?: string;

    @Field(() => String, {nullable:true})
    userAgent?: string;

    @Field(() => Date, {nullable:true})
    expiresAt?: Date | string;

    @Field(() => AccountUpdateOneRequiredWithoutSessionsNestedInput, {nullable:true})
    account?: AccountUpdateOneRequiredWithoutSessionsNestedInput;
}
