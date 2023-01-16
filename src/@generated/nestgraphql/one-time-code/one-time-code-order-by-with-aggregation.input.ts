import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { SortOrder } from '../prisma/sort-order.enum';
import { OneTimeCodeCountOrderByAggregateInput } from './one-time-code-count-order-by-aggregate.input';
import { OneTimeCodeAvgOrderByAggregateInput } from './one-time-code-avg-order-by-aggregate.input';
import { OneTimeCodeMaxOrderByAggregateInput } from './one-time-code-max-order-by-aggregate.input';
import { OneTimeCodeMinOrderByAggregateInput } from './one-time-code-min-order-by-aggregate.input';
import { OneTimeCodeSumOrderByAggregateInput } from './one-time-code-sum-order-by-aggregate.input';

@InputType()
export class OneTimeCodeOrderByWithAggregationInput {

    @Field(() => SortOrder, {nullable:true})
    id?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    createdAt?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    updatedAt?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    email?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    code?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    expiresAt?: keyof typeof SortOrder;

    @Field(() => OneTimeCodeCountOrderByAggregateInput, {nullable:true})
    _count?: OneTimeCodeCountOrderByAggregateInput;

    @Field(() => OneTimeCodeAvgOrderByAggregateInput, {nullable:true})
    _avg?: OneTimeCodeAvgOrderByAggregateInput;

    @Field(() => OneTimeCodeMaxOrderByAggregateInput, {nullable:true})
    _max?: OneTimeCodeMaxOrderByAggregateInput;

    @Field(() => OneTimeCodeMinOrderByAggregateInput, {nullable:true})
    _min?: OneTimeCodeMinOrderByAggregateInput;

    @Field(() => OneTimeCodeSumOrderByAggregateInput, {nullable:true})
    _sum?: OneTimeCodeSumOrderByAggregateInput;
}
