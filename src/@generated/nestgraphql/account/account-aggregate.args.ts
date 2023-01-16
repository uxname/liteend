import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { AccountWhereInput } from './account-where.input';
import { Type } from 'class-transformer';
import { AccountOrderByWithRelationInput } from './account-order-by-with-relation.input';
import { AccountWhereUniqueInput } from './account-where-unique.input';
import { Int } from '@nestjs/graphql';
import { AccountCountAggregateInput } from './account-count-aggregate.input';
import { AccountAvgAggregateInput } from './account-avg-aggregate.input';
import { AccountSumAggregateInput } from './account-sum-aggregate.input';
import { AccountMinAggregateInput } from './account-min-aggregate.input';
import { AccountMaxAggregateInput } from './account-max-aggregate.input';

@ArgsType()
export class AccountAggregateArgs {

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

    @Field(() => AccountCountAggregateInput, {nullable:true})
    _count?: AccountCountAggregateInput;

    @Field(() => AccountAvgAggregateInput, {nullable:true})
    _avg?: AccountAvgAggregateInput;

    @Field(() => AccountSumAggregateInput, {nullable:true})
    _sum?: AccountSumAggregateInput;

    @Field(() => AccountMinAggregateInput, {nullable:true})
    _min?: AccountMinAggregateInput;

    @Field(() => AccountMaxAggregateInput, {nullable:true})
    _max?: AccountMaxAggregateInput;
}
