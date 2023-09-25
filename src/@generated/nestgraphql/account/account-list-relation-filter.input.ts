import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountWhereInput } from './account-where.input';

@InputType()
export class AccountListRelationFilter {

    @Field(() => AccountWhereInput, {nullable:true})
    every?: AccountWhereInput;

    @Field(() => AccountWhereInput, {nullable:true})
    some?: AccountWhereInput;

    @Field(() => AccountWhereInput, {nullable:true})
    none?: AccountWhereInput;
}
