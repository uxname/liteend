import { IntWithAggregatesFilter } from '../prisma/int-with-aggregates-filter.input';
import { DateTimeWithAggregatesFilter } from '../prisma/date-time-with-aggregates-filter.input';
import { StringWithAggregatesFilter } from '../prisma/string-with-aggregates-filter.input';
import { IntNullableWithAggregatesFilter } from '../prisma/int-nullable-with-aggregates-filter.input';
export declare class AccountScalarWhereWithAggregatesInput {
    AND?: Array<AccountScalarWhereWithAggregatesInput>;
    OR?: Array<AccountScalarWhereWithAggregatesInput>;
    NOT?: Array<AccountScalarWhereWithAggregatesInput>;
    id?: IntWithAggregatesFilter;
    createdAt?: DateTimeWithAggregatesFilter;
    updatedAt?: DateTimeWithAggregatesFilter;
    email?: StringWithAggregatesFilter;
    passwordHash?: StringWithAggregatesFilter;
    profileId?: IntNullableWithAggregatesFilter;
}
