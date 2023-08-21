import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { OneTimeCodeWhereUniqueInput } from './one-time-code-where-unique.input';
import { Type } from 'class-transformer';

@ArgsType()
export class FindUniqueOneTimeCodeOrThrowArgs {

    @Field(() => OneTimeCodeWhereUniqueInput, {nullable:false})
    @Type(() => OneTimeCodeWhereUniqueInput)
    where!: Prisma.AtLeast<OneTimeCodeWhereUniqueInput, 'id' | 'email'>;
}
