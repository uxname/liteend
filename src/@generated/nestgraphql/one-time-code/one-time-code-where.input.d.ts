import { IntFilter } from '../prisma/int-filter.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { StringFilter } from '../prisma/string-filter.input';
export declare class OneTimeCodeWhereInput {
    AND?: Array<OneTimeCodeWhereInput>;
    OR?: Array<OneTimeCodeWhereInput>;
    NOT?: Array<OneTimeCodeWhereInput>;
    id?: IntFilter;
    createdAt?: DateTimeFilter;
    updatedAt?: DateTimeFilter;
    email?: StringFilter;
    code?: StringFilter;
    expiresAt?: DateTimeFilter;
}
