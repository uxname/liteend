import { SortOrder } from '../prisma/sort-order.enum';
export declare class OneTimeCodeOrderByWithRelationInput {
    id?: keyof typeof SortOrder;
    createdAt?: keyof typeof SortOrder;
    updatedAt?: keyof typeof SortOrder;
    email?: keyof typeof SortOrder;
    code?: keyof typeof SortOrder;
    expiresAt?: keyof typeof SortOrder;
}
