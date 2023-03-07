import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountCreateNestedOneWithoutSessionsInput } from '../account/account-create-nested-one-without-sessions.input';

@InputType()
export class AccountSessionCreateInput {

    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;

    @Field(() => String, {nullable:false})
    token!: string;

    @Field(() => String, {nullable:false})
    ipAddr!: string;

    @Field(() => String, {nullable:true})
    userAgent?: string;

    @Field(() => Date, {nullable:false})
    expiresAt!: Date | string;

    @Field(() => AccountCreateNestedOneWithoutSessionsInput, {nullable:false})
    account!: AccountCreateNestedOneWithoutSessionsInput;
}
