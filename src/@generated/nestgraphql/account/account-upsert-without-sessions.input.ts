import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountUpdateWithoutSessionsInput } from './account-update-without-sessions.input';
import { Type } from 'class-transformer';
import { AccountCreateWithoutSessionsInput } from './account-create-without-sessions.input';
import { AccountWhereInput } from './account-where.input';

@InputType()
export class AccountUpsertWithoutSessionsInput {

    @Field(() => AccountUpdateWithoutSessionsInput, {nullable:false})
    @Type(() => AccountUpdateWithoutSessionsInput)
    update!: AccountUpdateWithoutSessionsInput;

    @Field(() => AccountCreateWithoutSessionsInput, {nullable:false})
    @Type(() => AccountCreateWithoutSessionsInput)
    create!: AccountCreateWithoutSessionsInput;

    @Field(() => AccountWhereInput, {nullable:true})
    @Type(() => AccountWhereInput)
    where?: AccountWhereInput;
}
