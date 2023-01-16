import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { AccountSessionUpdateInput } from '../account-session/account-session-update.input';
import { Type } from 'class-transformer';
import { AccountSessionWhereUniqueInput } from '../account-session/account-session-where-unique.input';

@ArgsType()
export class UpdateOneAccountSessionArgs {

    @Field(() => AccountSessionUpdateInput, {nullable:false})
    @Type(() => AccountSessionUpdateInput)
    data!: AccountSessionUpdateInput;

    @Field(() => AccountSessionWhereUniqueInput, {nullable:false})
    @Type(() => AccountSessionWhereUniqueInput)
    where!: AccountSessionWhereUniqueInput;
}
