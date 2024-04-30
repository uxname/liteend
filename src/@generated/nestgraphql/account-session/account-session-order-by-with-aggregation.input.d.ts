import { SortOrder } from '../prisma/sort-order.enum';
import { SortOrderInput } from '../prisma/sort-order.input';
import { AccountSessionCountOrderByAggregateInput } from './account-session-count-order-by-aggregate.input';
import { AccountSessionAvgOrderByAggregateInput } from './account-session-avg-order-by-aggregate.input';
import { AccountSessionMaxOrderByAggregateInput } from './account-session-max-order-by-aggregate.input';
import { AccountSessionMinOrderByAggregateInput } from './account-session-min-order-by-aggregate.input';
import { AccountSessionSumOrderByAggregateInput } from './account-session-sum-order-by-aggregate.input';
export declare class AccountSessionOrderByWithAggregationInput {
    id?: keyof typeof SortOrder;
    createdAt?: keyof typeof SortOrder;
    updatedAt?: keyof typeof SortOrder;
    accountId?: keyof typeof SortOrder;
    token?: keyof typeof SortOrder;
    ipAddr?: keyof typeof SortOrder;
    userAgent?: SortOrderInput;
    expiresAt?: keyof typeof SortOrder;
    _count?: AccountSessionCountOrderByAggregateInput;
    _avg?: AccountSessionAvgOrderByAggregateInput;
    _max?: AccountSessionMaxOrderByAggregateInput;
    _min?: AccountSessionMinOrderByAggregateInput;
    _sum?: AccountSessionSumOrderByAggregateInput;
}
