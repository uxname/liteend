import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { IntWithAggregatesFilter } from '../prisma/int-with-aggregates-filter.input';
import { DateTimeWithAggregatesFilter } from '../prisma/date-time-with-aggregates-filter.input';
import { StringWithAggregatesFilter } from '../prisma/string-with-aggregates-filter.input';

@InputType()
export class EmailCodeScalarWhereWithAggregatesInput {

    @Field(() => [EmailCodeScalarWhereWithAggregatesInput], {nullable:true})
    AND?: Array<EmailCodeScalarWhereWithAggregatesInput>;

    @Field(() => [EmailCodeScalarWhereWithAggregatesInput], {nullable:true})
    OR?: Array<EmailCodeScalarWhereWithAggregatesInput>;

    @Field(() => [EmailCodeScalarWhereWithAggregatesInput], {nullable:true})
    NOT?: Array<EmailCodeScalarWhereWithAggregatesInput>;

    @Field(() => IntWithAggregatesFilter, {nullable:true})
    id?: IntWithAggregatesFilter;

    @Field(() => DateTimeWithAggregatesFilter, {nullable:true})
    createdAt?: DateTimeWithAggregatesFilter;

    @Field(() => DateTimeWithAggregatesFilter, {nullable:true})
    updatedAt?: DateTimeWithAggregatesFilter;

    @Field(() => StringWithAggregatesFilter, {nullable:true})
    email?: StringWithAggregatesFilter;

    @Field(() => StringWithAggregatesFilter, {nullable:true})
    code?: StringWithAggregatesFilter;

    @Field(() => DateTimeWithAggregatesFilter, {nullable:true})
    expiresAt?: DateTimeWithAggregatesFilter;
}
