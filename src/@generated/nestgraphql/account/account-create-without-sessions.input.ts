import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ProfileCreateNestedOneWithoutAccountsInput } from '../profile/profile-create-nested-one-without-accounts.input';

@InputType()
export class AccountCreateWithoutSessionsInput {

    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;

    @Field(() => String, {nullable:false})
    email!: string;

    @Field(() => String, {nullable:false})
    passwordHash!: string;

    @Field(() => ProfileCreateNestedOneWithoutAccountsInput, {nullable:true})
    profile?: ProfileCreateNestedOneWithoutAccountsInput;
}
