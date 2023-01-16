import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { SortOrder } from '../prisma/sort-order.enum';
import { EmailCodeCountOrderByAggregateInput } from './email-code-count-order-by-aggregate.input';
import { EmailCodeAvgOrderByAggregateInput } from './email-code-avg-order-by-aggregate.input';
import { EmailCodeMaxOrderByAggregateInput } from './email-code-max-order-by-aggregate.input';
import { EmailCodeMinOrderByAggregateInput } from './email-code-min-order-by-aggregate.input';
import { EmailCodeSumOrderByAggregateInput } from './email-code-sum-order-by-aggregate.input';

@InputType()
export class EmailCodeOrderByWithAggregationInput {

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

    @Field(() => EmailCodeCountOrderByAggregateInput, {nullable:true})
    _count?: EmailCodeCountOrderByAggregateInput;

    @Field(() => EmailCodeAvgOrderByAggregateInput, {nullable:true})
    _avg?: EmailCodeAvgOrderByAggregateInput;

    @Field(() => EmailCodeMaxOrderByAggregateInput, {nullable:true})
    _max?: EmailCodeMaxOrderByAggregateInput;

    @Field(() => EmailCodeMinOrderByAggregateInput, {nullable:true})
    _min?: EmailCodeMinOrderByAggregateInput;

    @Field(() => EmailCodeSumOrderByAggregateInput, {nullable:true})
    _sum?: EmailCodeSumOrderByAggregateInput;
}
