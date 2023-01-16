import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { AccountWhereInput } from './account-where.input';
import { Type } from 'class-transformer';
import { AccountOrderByWithRelationInput } from './account-order-by-with-relation.input';
import { AccountWhereUniqueInput } from './account-where-unique.input';
import { Int } from '@nestjs/graphql';
import { AccountScalarFieldEnum } from './account-scalar-field.enum';

@ArgsType()
export class FindFirstAccountOrThrowArgs {

    @Field(() => AccountWhereInput, {nullable:true})
    @Type(() => AccountWhereInput)
    where?: AccountWhereInput;

    @Field(() => [AccountOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<AccountOrderByWithRelationInput>;

    @Field(() => AccountWhereUniqueInput, {nullable:true})
    cursor?: AccountWhereUniqueInput;

    @Field(() => Int, {nullable:true})
    take?: number;

    @Field(() => Int, {nullable:true})
    skip?: number;

    @Field(() => [AccountScalarFieldEnum], {nullable:true})
    distinct?: Array<keyof typeof AccountScalarFieldEnum>;
}
