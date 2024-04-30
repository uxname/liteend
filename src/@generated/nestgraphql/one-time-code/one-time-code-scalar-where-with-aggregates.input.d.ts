import { IntWithAggregatesFilter } from '../prisma/int-with-aggregates-filter.input';
import { DateTimeWithAggregatesFilter } from '../prisma/date-time-with-aggregates-filter.input';
import { StringWithAggregatesFilter } from '../prisma/string-with-aggregates-filter.input';
export declare class OneTimeCodeScalarWhereWithAggregatesInput {
    AND?: Array<OneTimeCodeScalarWhereWithAggregatesInput>;
    OR?: Array<OneTimeCodeScalarWhereWithAggregatesInput>;
    NOT?: Array<OneTimeCodeScalarWhereWithAggregatesInput>;
    id?: IntWithAggregatesFilter;
    createdAt?: DateTimeWithAggregatesFilter;
    updatedAt?: DateTimeWithAggregatesFilter;
    email?: StringWithAggregatesFilter;
    code?: StringWithAggregatesFilter;
    expiresAt?: DateTimeWithAggregatesFilter;
}
