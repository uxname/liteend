import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { IntFilter } from '../prisma/int-filter.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { StringFilter } from '../prisma/string-filter.input';
import { StringNullableFilter } from '../prisma/string-nullable-filter.input';

@InputType()
export class AccountSessionScalarWhereInput {

    @Field(() => [AccountSessionScalarWhereInput], {nullable:true})
    AND?: Array<AccountSessionScalarWhereInput>;

    @Field(() => [AccountSessionScalarWhereInput], {nullable:true})
    OR?: Array<AccountSessionScalarWhereInput>;

    @Field(() => [AccountSessionScalarWhereInput], {nullable:true})
    NOT?: Array<AccountSessionScalarWhereInput>;

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
}
