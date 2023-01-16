import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { IntFilter } from '../prisma/int-filter.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { StringFilter } from '../prisma/string-filter.input';

@InputType()
export class EmailCodeWhereInput {

    @Field(() => [EmailCodeWhereInput], {nullable:true})
    AND?: Array<EmailCodeWhereInput>;

    @Field(() => [EmailCodeWhereInput], {nullable:true})
    OR?: Array<EmailCodeWhereInput>;

    @Field(() => [EmailCodeWhereInput], {nullable:true})
    NOT?: Array<EmailCodeWhereInput>;

    @Field(() => IntFilter, {nullable:true})
    id?: IntFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    createdAt?: DateTimeFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    updatedAt?: DateTimeFilter;

    @Field(() => StringFilter, {nullable:true})
    email?: StringFilter;

    @Field(() => StringFilter, {nullable:true})
    code?: StringFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    expiresAt?: DateTimeFilter;
}
