import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { OneTimeCodeWhereUniqueInput } from './one-time-code-where-unique.input';
import { Type } from 'class-transformer';
import { OneTimeCodeCreateInput } from './one-time-code-create.input';
import { OneTimeCodeUpdateInput } from './one-time-code-update.input';

@ArgsType()
export class UpsertOneOneTimeCodeArgs {

    @Field(() => OneTimeCodeWhereUniqueInput, {nullable:false})
    @Type(() => OneTimeCodeWhereUniqueInput)
    where!: Prisma.AtLeast<OneTimeCodeWhereUniqueInput, 'id' | 'email'>;

    @Field(() => OneTimeCodeCreateInput, {nullable:false})
    @Type(() => OneTimeCodeCreateInput)
    create!: OneTimeCodeCreateInput;

    @Field(() => OneTimeCodeUpdateInput, {nullable:false})
    @Type(() => OneTimeCodeUpdateInput)
    update!: OneTimeCodeUpdateInput;
}
