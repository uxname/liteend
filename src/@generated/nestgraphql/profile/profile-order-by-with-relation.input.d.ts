import { SortOrder } from '../prisma/sort-order.enum';
import { SortOrderInput } from '../prisma/sort-order.input';
import { AccountOrderByRelationAggregateInput } from '../account/account-order-by-relation-aggregate.input';
export declare class ProfileOrderByWithRelationInput {
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
    accounts?: AccountOrderByRelationAggregateInput;
}
