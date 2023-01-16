import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { IntWithAggregatesFilter } from '../prisma/int-with-aggregates-filter.input';
import { DateTimeWithAggregatesFilter } from '../prisma/date-time-with-aggregates-filter.input';
import { StringWithAggregatesFilter } from '../prisma/string-with-aggregates-filter.input';
import { StringNullableWithAggregatesFilter } from '../prisma/string-nullable-with-aggregates-filter.input';

@InputType()
export class AccountSessionScalarWhereWithAggregatesInput {

    @Field(() => [AccountSessionScalarWhereWithAggregatesInput], {nullable:true})
    AND?: Array<AccountSessionScalarWhereWithAggregatesInput>;

    @Field(() => [AccountSessionScalarWhereWithAggregatesInput], {nullable:true})
    OR?: Array<AccountSessionScalarWhereWithAggregatesInput>;

    @Field(() => [AccountSessionScalarWhereWithAggregatesInput], {nullable:true})
    NOT?: Array<AccountSessionScalarWhereWithAggregatesInput>;

    @Field(() => IntWithAggregatesFilter, {nullable:true})
    id?: IntWithAggregatesFilter;

    @Field(() => DateTimeWithAggregatesFilter, {nullable:true})
    createdAt?: DateTimeWithAggregatesFilter;

    @Field(() => DateTimeWithAggregatesFilter, {nullable:true})
    updatedAt?: DateTimeWithAggregatesFilter;

    @Field(() => IntWithAggregatesFilter, {nullable:true})
    accountId?: IntWithAggregatesFilter;

    @Field(() => StringWithAggregatesFilter, {nullable:true})
    token?: StringWithAggregatesFilter;

    @Field(() => StringWithAggregatesFilter, {nullable:true})
    ipAddr?: StringWithAggregatesFilter;

    @Field(() => StringNullableWithAggregatesFilter, {nullable:true})
    userAgent?: StringNullableWithAggregatesFilter;

    @Field(() => DateTimeWithAggregatesFilter, {nullable:true})
    expiresAt?: DateTimeWithAggregatesFilter;
}
