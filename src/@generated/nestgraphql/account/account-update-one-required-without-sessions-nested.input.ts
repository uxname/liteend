import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountCreateWithoutSessionsInput } from './account-create-without-sessions.input';
import { Type } from 'class-transformer';
import { AccountCreateOrConnectWithoutSessionsInput } from './account-create-or-connect-without-sessions.input';
import { AccountUpsertWithoutSessionsInput } from './account-upsert-without-sessions.input';
import { AccountWhereUniqueInput } from './account-where-unique.input';
import { AccountUpdateToOneWithWhereWithoutSessionsInput } from './account-update-to-one-with-where-without-sessions.input';

@InputType()
export class AccountUpdateOneRequiredWithoutSessionsNestedInput {

    @Field(() => AccountCreateWithoutSessionsInput, {nullable:true})
    @Type(() => AccountCreateWithoutSessionsInput)
    create?: AccountCreateWithoutSessionsInput;

    @Field(() => AccountCreateOrConnectWithoutSessionsInput, {nullable:true})
    @Type(() => AccountCreateOrConnectWithoutSessionsInput)
    connectOrCreate?: AccountCreateOrConnectWithoutSessionsInput;

    @Field(() => AccountUpsertWithoutSessionsInput, {nullable:true})
    @Type(() => AccountUpsertWithoutSessionsInput)
    upsert?: AccountUpsertWithoutSessionsInput;

    @Field(() => AccountWhereUniqueInput, {nullable:true})
    @Type(() => AccountWhereUniqueInput)
    connect?: AccountWhereUniqueInput;

    @Field(() => AccountUpdateToOneWithWhereWithoutSessionsInput, {nullable:true})
    @Type(() => AccountUpdateToOneWithWhereWithoutSessionsInput)
    update?: AccountUpdateToOneWithWhereWithoutSessionsInput;
}
