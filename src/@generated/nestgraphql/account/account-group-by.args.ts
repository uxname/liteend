import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { AccountWhereInput } from './account-where.input';
import { Type } from 'class-transformer';
import { AccountOrderByWithAggregationInput } from './account-order-by-with-aggregation.input';
import { AccountScalarFieldEnum } from './account-scalar-field.enum';
import { AccountScalarWhereWithAggregatesInput } from './account-scalar-where-with-aggregates.input';
import { Int } from '@nestjs/graphql';
import { AccountCountAggregateInput } from './account-count-aggregate.input';
import { AccountAvgAggregateInput } from './account-avg-aggregate.input';
import { AccountSumAggregateInput } from './account-sum-aggregate.input';
import { AccountMinAggregateInput } from './account-min-aggregate.input';
import { AccountMaxAggregateInput } from './account-max-aggregate.input';

@ArgsType()
export class AccountGroupByArgs {

    @Field(() => AccountWhereInput, {nullable:true})
    @Type(() => AccountWhereInput)
    where?: AccountWhereInput;

    @Field(() => [AccountOrderByWithAggregationInput], {nullable:true})
    orderBy?: Array<AccountOrderByWithAggregationInput>;

    @Field(() => [AccountScalarFieldEnum], {nullable:false})
    by!: Array<keyof typeof AccountScalarFieldEnum>;

    @Field(() => AccountScalarWhereWithAggregatesInput, {nullable:true})
    having?: AccountScalarWhereWithAggregatesInput;

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
