import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { AccountSessionUpdateInput } from './account-session-update.input';
import { Type } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { AccountSessionWhereUniqueInput } from './account-session-where-unique.input';

@ArgsType()
export class UpdateOneAccountSessionArgs {

    @Field(() => AccountSessionUpdateInput, {nullable:false})
    @Type(() => AccountSessionUpdateInput)
    data!: AccountSessionUpdateInput;

    @Field(() => AccountSessionWhereUniqueInput, {nullable:false})
    @Type(() => AccountSessionWhereUniqueInput)
    where!: Prisma.AtLeast<AccountSessionWhereUniqueInput, 'id' | 'token'>;
}
