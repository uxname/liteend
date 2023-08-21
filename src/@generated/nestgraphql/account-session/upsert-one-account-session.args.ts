import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { AccountSessionWhereUniqueInput } from './account-session-where-unique.input';
import { Type } from 'class-transformer';
import { AccountSessionCreateInput } from './account-session-create.input';
import { AccountSessionUpdateInput } from './account-session-update.input';

@ArgsType()
export class UpsertOneAccountSessionArgs {

    @Field(() => AccountSessionWhereUniqueInput, {nullable:false})
    @Type(() => AccountSessionWhereUniqueInput)
    where!: Prisma.AtLeast<AccountSessionWhereUniqueInput, 'id' | 'token'>;

    @Field(() => AccountSessionCreateInput, {nullable:false})
    @Type(() => AccountSessionCreateInput)
    create!: AccountSessionCreateInput;

    @Field(() => AccountSessionUpdateInput, {nullable:false})
    @Type(() => AccountSessionUpdateInput)
    update!: AccountSessionUpdateInput;
}
