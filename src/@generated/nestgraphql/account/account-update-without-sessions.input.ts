import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ProfileUpdateOneWithoutAccountsNestedInput } from '../profile/profile-update-one-without-accounts-nested.input';

@InputType()
export class AccountUpdateWithoutSessionsInput {

    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;

    @Field(() => String, {nullable:true})
    email?: string;

    @Field(() => String, {nullable:true})
    passwordHash?: string;

    @Field(() => ProfileUpdateOneWithoutAccountsNestedInput, {nullable:true})
    profile?: ProfileUpdateOneWithoutAccountsNestedInput;
}
