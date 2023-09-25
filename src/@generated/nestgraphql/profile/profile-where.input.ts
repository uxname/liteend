import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { IntFilter } from '../prisma/int-filter.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { EnumProfileRoleNullableListFilter } from '../prisma/enum-profile-role-nullable-list-filter.input';
import { EnumAccountStatusFilter } from '../prisma/enum-account-status-filter.input';
import { StringNullableFilter } from '../prisma/string-nullable-filter.input';
import { AccountListRelationFilter } from '../account/account-list-relation-filter.input';

@InputType()
export class ProfileWhereInput {

    @Field(() => [ProfileWhereInput], {nullable:true})
    AND?: Array<ProfileWhereInput>;

    @Field(() => [ProfileWhereInput], {nullable:true})
    OR?: Array<ProfileWhereInput>;

    @Field(() => [ProfileWhereInput], {nullable:true})
    NOT?: Array<ProfileWhereInput>;

    @Field(() => IntFilter, {nullable:true})
    id?: IntFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    createdAt?: DateTimeFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    updatedAt?: DateTimeFilter;

    @Field(() => EnumProfileRoleNullableListFilter, {nullable:true})
    roles?: EnumProfileRoleNullableListFilter;

    @Field(() => EnumAccountStatusFilter, {nullable:true})
    status?: EnumAccountStatusFilter;

    @Field(() => StringNullableFilter, {nullable:true})
    avatarUrl?: StringNullableFilter;

    @Field(() => StringNullableFilter, {nullable:true})
    name?: StringNullableFilter;

    @Field(() => StringNullableFilter, {nullable:true})
    bio?: StringNullableFilter;

    @Field(() => AccountListRelationFilter, {nullable:true})
    accounts?: AccountListRelationFilter;
}
