import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountCreaterolesInput } from './account-createroles.input';
import { AccountStatus } from '../prisma/account-status.enum';
import { AccountSessionCreateNestedManyWithoutAccountInput } from '../account-session/account-session-create-nested-many-without-account.input';

@InputType()
export class AccountCreateInput {

    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;

    @Field(() => String, {nullable:false})
    email!: string;

    @Field(() => String, {nullable:false})
    passwordHash!: string;

    @Field(() => AccountCreaterolesInput, {nullable:true})
    roles?: AccountCreaterolesInput;

    @Field(() => AccountStatus, {nullable:false})
    status!: keyof typeof AccountStatus;

    @Field(() => AccountSessionCreateNestedManyWithoutAccountInput, {nullable:true})
    sessions?: AccountSessionCreateNestedManyWithoutAccountInput;
}
