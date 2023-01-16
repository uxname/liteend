import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { AccountSessionWhereUniqueInput } from '../account-session/account-session-where-unique.input';
import { Type } from 'class-transformer';
import { AccountSessionCreateInput } from '../account-session/account-session-create.input';
import { AccountSessionUpdateInput } from '../account-session/account-session-update.input';

@ArgsType()
export class UpsertOneAccountSessionArgs {

    @Field(() => AccountSessionWhereUniqueInput, {nullable:false})
    @Type(() => AccountSessionWhereUniqueInput)
    where!: AccountSessionWhereUniqueInput;

    @Field(() => AccountSessionCreateInput, {nullable:false})
    @Type(() => AccountSessionCreateInput)
    create!: AccountSessionCreateInput;

    @Field(() => AccountSessionUpdateInput, {nullable:false})
    @Type(() => AccountSessionUpdateInput)
    update!: AccountSessionUpdateInput;
}
