import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { IntFilter } from '../prisma/int-filter.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { StringFilter } from '../prisma/string-filter.input';
import { StringNullableFilter } from '../prisma/string-nullable-filter.input';
import { AccountRelationFilter } from '../account/account-relation-filter.input';

@InputType()
export class AccountSessionWhereInput {

    @Field(() => [AccountSessionWhereInput], {nullable:true})
    AND?: Array<AccountSessionWhereInput>;

    @Field(() => [AccountSessionWhereInput], {nullable:true})
    OR?: Array<AccountSessionWhereInput>;

    @Field(() => [AccountSessionWhereInput], {nullable:true})
    NOT?: Array<AccountSessionWhereInput>;

    @Field(() => IntFilter, {nullable:true})
    id?: IntFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    createdAt?: DateTimeFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    updatedAt?: DateTimeFilter;

    @Field(() => IntFilter, {nullable:true})
    accountId?: IntFilter;

    @Field(() => StringFilter, {nullable:true})
    token?: StringFilter;

    @Field(() => StringFilter, {nullable:true})
    ipAddr?: StringFilter;

    @Field(() => StringNullableFilter, {nullable:true})
    userAgent?: StringNullableFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    expiresAt?: DateTimeFilter;

    @Field(() => AccountRelationFilter, {nullable:true})
    account?: AccountRelationFilter;
}
