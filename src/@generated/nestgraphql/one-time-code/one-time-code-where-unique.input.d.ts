import { OneTimeCodeWhereInput } from './one-time-code-where.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { StringFilter } from '../prisma/string-filter.input';
export declare class OneTimeCodeWhereUniqueInput {
    id?: number;
    email?: string;
    AND?: Array<OneTimeCodeWhereInput>;
    OR?: Array<OneTimeCodeWhereInput>;
    NOT?: Array<OneTimeCodeWhereInput>;
    createdAt?: DateTimeFilter;
    updatedAt?: DateTimeFilter;
    code?: StringFilter;
    expiresAt?: DateTimeFilter;
}
