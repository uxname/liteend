import { SortOrder } from '../prisma/sort-order.enum';
import { OneTimeCodeCountOrderByAggregateInput } from './one-time-code-count-order-by-aggregate.input';
import { OneTimeCodeAvgOrderByAggregateInput } from './one-time-code-avg-order-by-aggregate.input';
import { OneTimeCodeMaxOrderByAggregateInput } from './one-time-code-max-order-by-aggregate.input';
import { OneTimeCodeMinOrderByAggregateInput } from './one-time-code-min-order-by-aggregate.input';
import { OneTimeCodeSumOrderByAggregateInput } from './one-time-code-sum-order-by-aggregate.input';
export declare class OneTimeCodeOrderByWithAggregationInput {
    id?: keyof typeof SortOrder;
    createdAt?: keyof typeof SortOrder;
    updatedAt?: keyof typeof SortOrder;
    email?: keyof typeof SortOrder;
    code?: keyof typeof SortOrder;
    expiresAt?: keyof typeof SortOrder;
    _count?: OneTimeCodeCountOrderByAggregateInput;
    _avg?: OneTimeCodeAvgOrderByAggregateInput;
    _max?: OneTimeCodeMaxOrderByAggregateInput;
    _min?: OneTimeCodeMinOrderByAggregateInput;
    _sum?: OneTimeCodeSumOrderByAggregateInput;
}
