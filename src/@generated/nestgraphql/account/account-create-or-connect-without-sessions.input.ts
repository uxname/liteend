import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountWhereUniqueInput } from './account-where-unique.input';
import { Type } from 'class-transformer';
import { AccountCreateWithoutSessionsInput } from './account-create-without-sessions.input';

@InputType()
export class AccountCreateOrConnectWithoutSessionsInput {

    @Field(() => AccountWhereUniqueInput, {nullable:false})
    @Type(() => AccountWhereUniqueInput)
    where!: AccountWhereUniqueInput;

    @Field(() => AccountCreateWithoutSessionsInput, {nullable:false})
    @Type(() => AccountCreateWithoutSessionsInput)
    create!: AccountCreateWithoutSessionsInput;
}
