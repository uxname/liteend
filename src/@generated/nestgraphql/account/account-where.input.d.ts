import { IntFilter } from '../prisma/int-filter.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { StringFilter } from '../prisma/string-filter.input';
import { IntNullableFilter } from '../prisma/int-nullable-filter.input';
import { AccountSessionListRelationFilter } from '../account-session/account-session-list-relation-filter.input';
import { ProfileNullableRelationFilter } from '../profile/profile-nullable-relation-filter.input';
export declare class AccountWhereInput {
    AND?: Array<AccountWhereInput>;
    OR?: Array<AccountWhereInput>;
    NOT?: Array<AccountWhereInput>;
    id?: IntFilter;
    createdAt?: DateTimeFilter;
    updatedAt?: DateTimeFilter;
    email?: StringFilter;
    passwordHash?: StringFilter;
    profileId?: IntNullableFilter;
    sessions?: AccountSessionListRelationFilter;
    profile?: ProfileNullableRelationFilter;
}
