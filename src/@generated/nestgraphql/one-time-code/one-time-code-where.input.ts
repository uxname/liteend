import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { IntFilter } from '../prisma/int-filter.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { StringFilter } from '../prisma/string-filter.input';

@InputType()
export class OneTimeCodeWhereInput {

    @Field(() => [OneTimeCodeWhereInput], {nullable:true})
    AND?: Array<OneTimeCodeWhereInput>;

    @Field(() => [OneTimeCodeWhereInput], {nullable:true})
    OR?: Array<OneTimeCodeWhereInput>;

    @Field(() => [OneTimeCodeWhereInput], {nullable:true})
    NOT?: Array<OneTimeCodeWhereInput>;

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
