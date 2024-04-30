import { SortOrder } from '../prisma/sort-order.enum';
export declare class AccountMinOrderByAggregateInput {
    id?: keyof typeof SortOrder;
    createdAt?: keyof typeof SortOrder;
    updatedAt?: keyof typeof SortOrder;
    email?: keyof typeof SortOrder;
    passwordHash?: keyof typeof SortOrder;
    profileId?: keyof typeof SortOrder;
}
