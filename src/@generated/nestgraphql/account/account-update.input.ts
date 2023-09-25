import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountSessionUpdateManyWithoutAccountNestedInput } from '../account-session/account-session-update-many-without-account-nested.input';
import { ProfileUpdateOneWithoutAccountsNestedInput } from '../profile/profile-update-one-without-accounts-nested.input';

@InputType()
export class AccountUpdateInput {

    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;

    @Field(() => String, {nullable:true})
    email?: string;

    @Field(() => String, {nullable:true})
    passwordHash?: string;

    @Field(() => AccountSessionUpdateManyWithoutAccountNestedInput, {nullable:true})
    sessions?: AccountSessionUpdateManyWithoutAccountNestedInput;

    @Field(() => ProfileUpdateOneWithoutAccountsNestedInput, {nullable:true})
    profile?: ProfileUpdateOneWithoutAccountsNestedInput;
}
