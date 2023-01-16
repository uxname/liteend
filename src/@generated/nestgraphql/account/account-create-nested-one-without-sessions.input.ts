import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountCreateWithoutSessionsInput } from './account-create-without-sessions.input';
import { Type } from 'class-transformer';
import { AccountCreateOrConnectWithoutSessionsInput } from './account-create-or-connect-without-sessions.input';
import { AccountWhereUniqueInput } from './account-where-unique.input';

@InputType()
export class AccountCreateNestedOneWithoutSessionsInput {

    @Field(() => AccountCreateWithoutSessionsInput, {nullable:true})
    @Type(() => AccountCreateWithoutSessionsInput)
    create?: AccountCreateWithoutSessionsInput;

    @Field(() => AccountCreateOrConnectWithoutSessionsInput, {nullable:true})
    @Type(() => AccountCreateOrConnectWithoutSessionsInput)
    connectOrCreate?: AccountCreateOrConnectWithoutSessionsInput;

    @Field(() => AccountWhereUniqueInput, {nullable:true})
    @Type(() => AccountWhereUniqueInput)
    connect?: AccountWhereUniqueInput;
}
