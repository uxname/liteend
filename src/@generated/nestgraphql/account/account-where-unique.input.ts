import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { AccountWhereInput } from './account-where.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { StringFilter } from '../prisma/string-filter.input';
import { IntNullableFilter } from '../prisma/int-nullable-filter.input';
import { AccountSessionListRelationFilter } from '../account-session/account-session-list-relation-filter.input';
import { ProfileNullableRelationFilter } from '../profile/profile-nullable-relation-filter.input';

@InputType()
export class AccountWhereUniqueInput {

    @Field(() => Int, {nullable:true})
    id?: number;

    @Field(() => String, {nullable:true})
    email?: string;

    @Field(() => [AccountWhereInput], {nullable:true})
    AND?: Array<AccountWhereInput>;

    @Field(() => [AccountWhereInput], {nullable:true})
    OR?: Array<AccountWhereInput>;

    @Field(() => [AccountWhereInput], {nullable:true})
    NOT?: Array<AccountWhereInput>;

    @Field(() => DateTimeFilter, {nullable:true})
    createdAt?: DateTimeFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    updatedAt?: DateTimeFilter;

    @Field(() => StringFilter, {nullable:true})
    passwordHash?: StringFilter;

    @Field(() => IntNullableFilter, {nullable:true})
    profileId?: IntNullableFilter;

    @Field(() => AccountSessionListRelationFilter, {nullable:true})
    sessions?: AccountSessionListRelationFilter;

    @Field(() => ProfileNullableRelationFilter, {nullable:true})
    profile?: ProfileNullableRelationFilter;
}
