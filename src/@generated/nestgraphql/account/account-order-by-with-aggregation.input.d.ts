import { SortOrder } from '../prisma/sort-order.enum';
import { SortOrderInput } from '../prisma/sort-order.input';
import { AccountCountOrderByAggregateInput } from './account-count-order-by-aggregate.input';
import { AccountAvgOrderByAggregateInput } from './account-avg-order-by-aggregate.input';
import { AccountMaxOrderByAggregateInput } from './account-max-order-by-aggregate.input';
import { AccountMinOrderByAggregateInput } from './account-min-order-by-aggregate.input';
import { AccountSumOrderByAggregateInput } from './account-sum-order-by-aggregate.input';
export declare class AccountOrderByWithAggregationInput {
    id?: keyof typeof SortOrder;
    createdAt?: keyof typeof SortOrder;
    updatedAt?: keyof typeof SortOrder;
    email?: keyof typeof SortOrder;
    passwordHash?: keyof typeof SortOrder;
    profileId?: SortOrderInput;
    _count?: AccountCountOrderByAggregateInput;
    _avg?: AccountAvgOrderByAggregateInput;
    _max?: AccountMaxOrderByAggregateInput;
    _min?: AccountMinOrderByAggregateInput;
    _sum?: AccountSumOrderByAggregateInput;
}
