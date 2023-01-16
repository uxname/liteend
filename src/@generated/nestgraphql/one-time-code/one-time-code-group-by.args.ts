import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { OneTimeCodeWhereInput } from './one-time-code-where.input';
import { Type } from 'class-transformer';
import { OneTimeCodeOrderByWithAggregationInput } from './one-time-code-order-by-with-aggregation.input';
import { OneTimeCodeScalarFieldEnum } from './one-time-code-scalar-field.enum';
import { OneTimeCodeScalarWhereWithAggregatesInput } from './one-time-code-scalar-where-with-aggregates.input';
import { Int } from '@nestjs/graphql';
import { OneTimeCodeCountAggregateInput } from './one-time-code-count-aggregate.input';
import { OneTimeCodeAvgAggregateInput } from './one-time-code-avg-aggregate.input';
import { OneTimeCodeSumAggregateInput } from './one-time-code-sum-aggregate.input';
import { OneTimeCodeMinAggregateInput } from './one-time-code-min-aggregate.input';
import { OneTimeCodeMaxAggregateInput } from './one-time-code-max-aggregate.input';

@ArgsType()
export class OneTimeCodeGroupByArgs {

    @Field(() => OneTimeCodeWhereInput, {nullable:true})
    @Type(() => OneTimeCodeWhereInput)
    where?: OneTimeCodeWhereInput;

    @Field(() => [OneTimeCodeOrderByWithAggregationInput], {nullable:true})
    orderBy?: Array<OneTimeCodeOrderByWithAggregationInput>;

    @Field(() => [OneTimeCodeScalarFieldEnum], {nullable:false})
    by!: Array<keyof typeof OneTimeCodeScalarFieldEnum>;

    @Field(() => OneTimeCodeScalarWhereWithAggregatesInput, {nullable:true})
    having?: OneTimeCodeScalarWhereWithAggregatesInput;

    @Field(() => Int, {nullable:true})
    take?: number;

    @Field(() => Int, {nullable:true})
    skip?: number;

    @Field(() => OneTimeCodeCountAggregateInput, {nullable:true})
    _count?: OneTimeCodeCountAggregateInput;

    @Field(() => OneTimeCodeAvgAggregateInput, {nullable:true})
    _avg?: OneTimeCodeAvgAggregateInput;

    @Field(() => OneTimeCodeSumAggregateInput, {nullable:true})
    _sum?: OneTimeCodeSumAggregateInput;

    @Field(() => OneTimeCodeMinAggregateInput, {nullable:true})
    _min?: OneTimeCodeMinAggregateInput;

    @Field(() => OneTimeCodeMaxAggregateInput, {nullable:true})
    _max?: OneTimeCodeMaxAggregateInput;
}
