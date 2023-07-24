import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { AccountSessionWhereInput } from './account-session-where.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { IntFilter } from '../prisma/int-filter.input';
import { StringFilter } from '../prisma/string-filter.input';
import { StringNullableFilter } from '../prisma/string-nullable-filter.input';
import { AccountRelationFilter } from '../account/account-relation-filter.input';

@InputType()
export class AccountSessionWhereUniqueInput {

    @Field(() => Int, {nullable:true})
    id?: number;

    @Field(() => String, {nullable:true})
    token?: string;

    @Field(() => [AccountSessionWhereInput], {nullable:true})
    AND?: Array<AccountSessionWhereInput>;

    @Field(() => [AccountSessionWhereInput], {nullable:true})
    OR?: Array<AccountSessionWhereInput>;

    @Field(() => [AccountSessionWhereInput], {nullable:true})
    NOT?: Array<AccountSessionWhereInput>;

    @Field(() => DateTimeFilter, {nullable:true})
    createdAt?: DateTimeFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    updatedAt?: DateTimeFilter;

    @Field(() => IntFilter, {nullable:true})
    accountId?: IntFilter;

    @Field(() => StringFilter, {nullable:true})
    ipAddr?: StringFilter;

    @Field(() => StringNullableFilter, {nullable:true})
    userAgent?: StringNullableFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    expiresAt?: DateTimeFilter;

    @Field(() => AccountRelationFilter, {nullable:true})
    account?: AccountRelationFilter;
}
