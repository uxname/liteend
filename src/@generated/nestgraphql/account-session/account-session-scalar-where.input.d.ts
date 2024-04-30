import { IntFilter } from '../prisma/int-filter.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { StringFilter } from '../prisma/string-filter.input';
import { StringNullableFilter } from '../prisma/string-nullable-filter.input';
export declare class AccountSessionScalarWhereInput {
    AND?: Array<AccountSessionScalarWhereInput>;
    OR?: Array<AccountSessionScalarWhereInput>;
    NOT?: Array<AccountSessionScalarWhereInput>;
    id?: IntFilter;
    createdAt?: DateTimeFilter;
    updatedAt?: DateTimeFilter;
    accountId?: IntFilter;
    token?: StringFilter;
    ipAddr?: StringFilter;
    userAgent?: StringNullableFilter;
    expiresAt?: DateTimeFilter;
}
