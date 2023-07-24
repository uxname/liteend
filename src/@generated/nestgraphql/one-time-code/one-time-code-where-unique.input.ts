import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { OneTimeCodeWhereInput } from './one-time-code-where.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { StringFilter } from '../prisma/string-filter.input';

@InputType()
export class OneTimeCodeWhereUniqueInput {

    @Field(() => Int, {nullable:true})
    id?: number;

    @Field(() => String, {nullable:true})
    email?: string;

    @Field(() => [OneTimeCodeWhereInput], {nullable:true})
    AND?: Array<OneTimeCodeWhereInput>;

    @Field(() => [OneTimeCodeWhereInput], {nullable:true})
    OR?: Array<OneTimeCodeWhereInput>;

    @Field(() => [OneTimeCodeWhereInput], {nullable:true})
    NOT?: Array<OneTimeCodeWhereInput>;

    @Field(() => DateTimeFilter, {nullable:true})
    createdAt?: DateTimeFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    updatedAt?: DateTimeFilter;

    @Field(() => StringFilter, {nullable:true})
    code?: StringFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    expiresAt?: DateTimeFilter;
}
