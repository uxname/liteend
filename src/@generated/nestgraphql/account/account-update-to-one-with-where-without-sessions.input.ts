import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountWhereInput } from './account-where.input';
import { Type } from 'class-transformer';
import { AccountUpdateWithoutSessionsInput } from './account-update-without-sessions.input';

@InputType()
export class AccountUpdateToOneWithWhereWithoutSessionsInput {

    @Field(() => AccountWhereInput, {nullable:true})
    @Type(() => AccountWhereInput)
    where?: AccountWhereInput;

    @Field(() => AccountUpdateWithoutSessionsInput, {nullable:false})
    @Type(() => AccountUpdateWithoutSessionsInput)
    data!: AccountUpdateWithoutSessionsInput;
}
