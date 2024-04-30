import { SortOrder } from '../prisma/sort-order.enum';
import { SortOrderInput } from '../prisma/sort-order.input';
import { AccountOrderByWithRelationInput } from '../account/account-order-by-with-relation.input';
export declare class AccountSessionOrderByWithRelationInput {
    id?: keyof typeof SortOrder;
    createdAt?: keyof typeof SortOrder;
    updatedAt?: keyof typeof SortOrder;
    accountId?: keyof typeof SortOrder;
    token?: keyof typeof SortOrder;
    ipAddr?: keyof typeof SortOrder;
    userAgent?: SortOrderInput;
    expiresAt?: keyof typeof SortOrder;
    account?: AccountOrderByWithRelationInput;
}
