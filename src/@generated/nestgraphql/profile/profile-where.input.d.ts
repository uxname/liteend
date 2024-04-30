import { IntFilter } from '../prisma/int-filter.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { EnumProfileRoleNullableListFilter } from '../prisma/enum-profile-role-nullable-list-filter.input';
import { EnumAccountStatusFilter } from '../prisma/enum-account-status-filter.input';
import { StringNullableFilter } from '../prisma/string-nullable-filter.input';
import { BoolFilter } from '../prisma/bool-filter.input';
import { AccountListRelationFilter } from '../account/account-list-relation-filter.input';
export declare class ProfileWhereInput {
    AND?: Array<ProfileWhereInput>;
    OR?: Array<ProfileWhereInput>;
    NOT?: Array<ProfileWhereInput>;
    id?: IntFilter;
    createdAt?: DateTimeFilter;
    updatedAt?: DateTimeFilter;
    roles?: EnumProfileRoleNullableListFilter;
    status?: EnumAccountStatusFilter;
    avatarUrl?: StringNullableFilter;
    name?: StringNullableFilter;
    bio?: StringNullableFilter;
    totpEnabled?: BoolFilter;
    totpSecret?: StringNullableFilter;
    accounts?: AccountListRelationFilter;
}
