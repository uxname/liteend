import { SortOrder } from '../prisma/sort-order.enum';
import { SortOrderInput } from '../prisma/sort-order.input';
import { AccountSessionOrderByRelationAggregateInput } from '../account-session/account-session-order-by-relation-aggregate.input';
import { ProfileOrderByWithRelationInput } from '../profile/profile-order-by-with-relation.input';
export declare class AccountOrderByWithRelationInput {
    id?: keyof typeof SortOrder;
    createdAt?: keyof typeof SortOrder;
    updatedAt?: keyof typeof SortOrder;
    email?: keyof typeof SortOrder;
    passwordHash?: keyof typeof SortOrder;
    profileId?: SortOrderInput;
    sessions?: AccountSessionOrderByRelationAggregateInput;
    profile?: ProfileOrderByWithRelationInput;
}
