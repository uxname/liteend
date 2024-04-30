import { AccountSessionWhereInput } from './account-session-where.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { IntFilter } from '../prisma/int-filter.input';
import { StringFilter } from '../prisma/string-filter.input';
import { StringNullableFilter } from '../prisma/string-nullable-filter.input';
import { AccountRelationFilter } from '../account/account-relation-filter.input';
export declare class AccountSessionWhereUniqueInput {
    id?: number;
    token?: string;
    AND?: Array<AccountSessionWhereInput>;
    OR?: Array<AccountSessionWhereInput>;
    NOT?: Array<AccountSessionWhereInput>;
    createdAt?: DateTimeFilter;
    updatedAt?: DateTimeFilter;
    accountId?: IntFilter;
    ipAddr?: StringFilter;
    userAgent?: StringNullableFilter;
    expiresAt?: DateTimeFilter;
    account?: AccountRelationFilter;
}
