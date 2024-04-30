import { IntFilter } from '../prisma/int-filter.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { StringFilter } from '../prisma/string-filter.input';
import { StringNullableFilter } from '../prisma/string-nullable-filter.input';
import { AccountRelationFilter } from '../account/account-relation-filter.input';
export declare class AccountSessionWhereInput {
    AND?: Array<AccountSessionWhereInput>;
    OR?: Array<AccountSessionWhereInput>;
    NOT?: Array<AccountSessionWhereInput>;
    id?: IntFilter;
    createdAt?: DateTimeFilter;
    updatedAt?: DateTimeFilter;
    accountId?: IntFilter;
    token?: StringFilter;
    ipAddr?: StringFilter;
    userAgent?: StringNullableFilter;
    expiresAt?: DateTimeFilter;
    account?: AccountRelationFilter;
}
