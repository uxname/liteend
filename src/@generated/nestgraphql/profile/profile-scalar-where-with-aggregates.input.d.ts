import { IntWithAggregatesFilter } from '../prisma/int-with-aggregates-filter.input';
import { DateTimeWithAggregatesFilter } from '../prisma/date-time-with-aggregates-filter.input';
import { EnumProfileRoleNullableListFilter } from '../prisma/enum-profile-role-nullable-list-filter.input';
import { EnumAccountStatusWithAggregatesFilter } from '../prisma/enum-account-status-with-aggregates-filter.input';
import { StringNullableWithAggregatesFilter } from '../prisma/string-nullable-with-aggregates-filter.input';
import { BoolWithAggregatesFilter } from '../prisma/bool-with-aggregates-filter.input';
export declare class ProfileScalarWhereWithAggregatesInput {
    AND?: Array<ProfileScalarWhereWithAggregatesInput>;
    OR?: Array<ProfileScalarWhereWithAggregatesInput>;
    NOT?: Array<ProfileScalarWhereWithAggregatesInput>;
    id?: IntWithAggregatesFilter;
    createdAt?: DateTimeWithAggregatesFilter;
    updatedAt?: DateTimeWithAggregatesFilter;
    roles?: EnumProfileRoleNullableListFilter;
    status?: EnumAccountStatusWithAggregatesFilter;
    avatarUrl?: StringNullableWithAggregatesFilter;
    name?: StringNullableWithAggregatesFilter;
    bio?: StringNullableWithAggregatesFilter;
    totpEnabled?: BoolWithAggregatesFilter;
    totpSecret?: StringNullableWithAggregatesFilter;
}
