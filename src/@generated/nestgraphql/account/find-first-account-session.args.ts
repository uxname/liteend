import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { AccountSessionWhereInput } from '../account-session/account-session-where.input';
import { Type } from 'class-transformer';
import { AccountSessionOrderByWithRelationInput } from '../account-session/account-session-order-by-with-relation.input';
import { AccountSessionWhereUniqueInput } from '../account-session/account-session-where-unique.input';
import { Int } from '@nestjs/graphql';
import { AccountSessionScalarFieldEnum } from '../account-session/account-session-scalar-field.enum';

@ArgsType()
export class FindFirstAccountSessionArgs {

    @Field(() => AccountSessionWhereInput, {nullable:true})
    @Type(() => AccountSessionWhereInput)
    where?: AccountSessionWhereInput;

    @Field(() => [AccountSessionOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<AccountSessionOrderByWithRelationInput>;

    @Field(() => AccountSessionWhereUniqueInput, {nullable:true})
    cursor?: AccountSessionWhereUniqueInput;

    @Field(() => Int, {nullable:true})
    take?: number;

    @Field(() => Int, {nullable:true})
    skip?: number;

    @Field(() => [AccountSessionScalarFieldEnum], {nullable:true})
    distinct?: Array<keyof typeof AccountSessionScalarFieldEnum>;
}
