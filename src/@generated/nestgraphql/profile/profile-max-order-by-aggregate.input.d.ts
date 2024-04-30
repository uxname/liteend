import { SortOrder } from '../prisma/sort-order.enum';
export declare class ProfileMaxOrderByAggregateInput {
    id?: keyof typeof SortOrder;
    createdAt?: keyof typeof SortOrder;
    updatedAt?: keyof typeof SortOrder;
    status?: keyof typeof SortOrder;
    avatarUrl?: keyof typeof SortOrder;
    name?: keyof typeof SortOrder;
    bio?: keyof typeof SortOrder;
    totpEnabled?: keyof typeof SortOrder;
    totpSecret?: keyof typeof SortOrder;
}
