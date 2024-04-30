import { AccountWhereInput } from './account-where.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { StringFilter } from '../prisma/string-filter.input';
import { IntNullableFilter } from '../prisma/int-nullable-filter.input';
import { AccountSessionListRelationFilter } from '../account-session/account-session-list-relation-filter.input';
import { ProfileNullableRelationFilter } from '../profile/profile-nullable-relation-filter.input';
export declare class AccountWhereUniqueInput {
    id?: number;
    email?: string;
    AND?: Array<AccountWhereInput>;
    OR?: Array<AccountWhereInput>;
    NOT?: Array<AccountWhereInput>;
    createdAt?: DateTimeFilter;
    updatedAt?: DateTimeFilter;
    passwordHash?: StringFilter;
    profileId?: IntNullableFilter;
    sessions?: AccountSessionListRelationFilter;
    profile?: ProfileNullableRelationFilter;
}
