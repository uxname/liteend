import { IntFilter } from '../prisma/int-filter.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { StringFilter } from '../prisma/string-filter.input';
import { IntNullableFilter } from '../prisma/int-nullable-filter.input';
export declare class AccountScalarWhereInput {
    AND?: Array<AccountScalarWhereInput>;
    OR?: Array<AccountScalarWhereInput>;
    NOT?: Array<AccountScalarWhereInput>;
    id?: IntFilter;
    createdAt?: DateTimeFilter;
    updatedAt?: DateTimeFilter;
    email?: StringFilter;
    passwordHash?: StringFilter;
    profileId?: IntNullableFilter;
}
