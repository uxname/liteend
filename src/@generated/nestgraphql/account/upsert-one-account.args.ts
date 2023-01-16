import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { AccountWhereUniqueInput } from './account-where-unique.input';
import { Type } from 'class-transformer';
import { AccountCreateInput } from './account-create.input';
import { AccountUpdateInput } from './account-update.input';

@ArgsType()
export class UpsertOneAccountArgs {

    @Field(() => AccountWhereUniqueInput, {nullable:false})
    @Type(() => AccountWhereUniqueInput)
    where!: AccountWhereUniqueInput;

    @Field(() => AccountCreateInput, {nullable:false})
    @Type(() => AccountCreateInput)
    create!: AccountCreateInput;

    @Field(() => AccountUpdateInput, {nullable:false})
    @Type(() => AccountUpdateInput)
    update!: AccountUpdateInput;
}
