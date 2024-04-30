import { IntWithAggregatesFilter } from '../prisma/int-with-aggregates-filter.input';
import { DateTimeWithAggregatesFilter } from '../prisma/date-time-with-aggregates-filter.input';
import { StringWithAggregatesFilter } from '../prisma/string-with-aggregates-filter.input';
import { StringNullableWithAggregatesFilter } from '../prisma/string-nullable-with-aggregates-filter.input';
export declare class AccountSessionScalarWhereWithAggregatesInput {
    AND?: Array<AccountSessionScalarWhereWithAggregatesInput>;
    OR?: Array<AccountSessionScalarWhereWithAggregatesInput>;
    NOT?: Array<AccountSessionScalarWhereWithAggregatesInput>;
    id?: IntWithAggregatesFilter;
    createdAt?: DateTimeWithAggregatesFilter;
    updatedAt?: DateTimeWithAggregatesFilter;
    accountId?: IntWithAggregatesFilter;
    token?: StringWithAggregatesFilter;
    ipAddr?: StringWithAggregatesFilter;
    userAgent?: StringNullableWithAggregatesFilter;
    expiresAt?: DateTimeWithAggregatesFilter;
}
