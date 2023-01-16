import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { SortOrder } from '../prisma/sort-order.enum';
import { AccountSessionCountOrderByAggregateInput } from './account-session-count-order-by-aggregate.input';
import { AccountSessionAvgOrderByAggregateInput } from './account-session-avg-order-by-aggregate.input';
import { AccountSessionMaxOrderByAggregateInput } from './account-session-max-order-by-aggregate.input';
import { AccountSessionMinOrderByAggregateInput } from './account-session-min-order-by-aggregate.input';
import { AccountSessionSumOrderByAggregateInput } from './account-session-sum-order-by-aggregate.input';

@InputType()
export class AccountSessionOrderByWithAggregationInput {

    @Field(() => SortOrder, {nullable:true})
    id?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    createdAt?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    updatedAt?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    accountId?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    token?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    ipAddr?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    userAgent?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    expiresAt?: keyof typeof SortOrder;

    @Field(() => AccountSessionCountOrderByAggregateInput, {nullable:true})
    _count?: AccountSessionCountOrderByAggregateInput;

    @Field(() => AccountSessionAvgOrderByAggregateInput, {nullable:true})
    _avg?: AccountSessionAvgOrderByAggregateInput;

    @Field(() => AccountSessionMaxOrderByAggregateInput, {nullable:true})
    _max?: AccountSessionMaxOrderByAggregateInput;

    @Field(() => AccountSessionMinOrderByAggregateInput, {nullable:true})
    _min?: AccountSessionMinOrderByAggregateInput;

    @Field(() => AccountSessionSumOrderByAggregateInput, {nullable:true})
    _sum?: AccountSessionSumOrderByAggregateInput;
}
