import { SortOrder } from '../prisma/sort-order.enum';
export declare class AccountSessionMinOrderByAggregateInput {
    id?: keyof typeof SortOrder;
    createdAt?: keyof typeof SortOrder;
    updatedAt?: keyof typeof SortOrder;
    accountId?: keyof typeof SortOrder;
    token?: keyof typeof SortOrder;
    ipAddr?: keyof typeof SortOrder;
    userAgent?: keyof typeof SortOrder;
    expiresAt?: keyof typeof SortOrder;
}
