import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountSessionWhereInput } from './account-session-where.input';

@InputType()
export class AccountSessionListRelationFilter {

    @Field(() => AccountSessionWhereInput, {nullable:true})
    every?: AccountSessionWhereInput;

    @Field(() => AccountSessionWhereInput, {nullable:true})
    some?: AccountSessionWhereInput;

    @Field(() => AccountSessionWhereInput, {nullable:true})
    none?: AccountSessionWhereInput;
}
