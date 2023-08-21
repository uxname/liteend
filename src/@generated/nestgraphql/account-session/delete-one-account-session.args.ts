import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { AccountSessionWhereUniqueInput } from './account-session-where-unique.input';
import { Type } from 'class-transformer';

@ArgsType()
export class DeleteOneAccountSessionArgs {

    @Field(() => AccountSessionWhereUniqueInput, {nullable:false})
    @Type(() => AccountSessionWhereUniqueInput)
    where!: Prisma.AtLeast<AccountSessionWhereUniqueInput, 'id' | 'token'>;
}
