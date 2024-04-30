import { SortOrder } from '../prisma/sort-order.enum';
import { SortOrderInput } from '../prisma/sort-order.input';
import { ProfileCountOrderByAggregateInput } from './profile-count-order-by-aggregate.input';
import { ProfileAvgOrderByAggregateInput } from './profile-avg-order-by-aggregate.input';
import { ProfileMaxOrderByAggregateInput } from './profile-max-order-by-aggregate.input';
import { ProfileMinOrderByAggregateInput } from './profile-min-order-by-aggregate.input';
import { ProfileSumOrderByAggregateInput } from './profile-sum-order-by-aggregate.input';
export declare class ProfileOrderByWithAggregationInput {
    id?: keyof typeof SortOrder;
    createdAt?: keyof typeof SortOrder;
    updatedAt?: keyof typeof SortOrder;
    roles?: keyof typeof SortOrder;
    status?: keyof typeof SortOrder;
    avatarUrl?: SortOrderInput;
    name?: SortOrderInput;
    bio?: SortOrderInput;
    totpEnabled?: keyof typeof SortOrder;
    totpSecret?: SortOrderInput;
    _count?: ProfileCountOrderByAggregateInput;
    _avg?: ProfileAvgOrderByAggregateInput;
    _max?: ProfileMaxOrderByAggregateInput;
    _min?: ProfileMinOrderByAggregateInput;
    _sum?: ProfileSumOrderByAggregateInput;
}
