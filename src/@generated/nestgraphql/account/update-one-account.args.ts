import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { AccountUpdateInput } from './account-update.input';
import { Type } from 'class-transformer';
import { AccountWhereUniqueInput } from './account-where-unique.input';

@ArgsType()
export class UpdateOneAccountArgs {

    @Field(() => AccountUpdateInput, {nullable:false})
    @Type(() => AccountUpdateInput)
    data!: AccountUpdateInput;

    @Field(() => AccountWhereUniqueInput, {nullable:false})
    @Type(() => AccountWhereUniqueInput)
    where!: AccountWhereUniqueInput;
}
