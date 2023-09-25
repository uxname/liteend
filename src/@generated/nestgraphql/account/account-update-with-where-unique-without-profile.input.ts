import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { AccountWhereUniqueInput } from './account-where-unique.input';
import { Type } from 'class-transformer';
import { AccountUpdateWithoutProfileInput } from './account-update-without-profile.input';

@InputType()
export class AccountUpdateWithWhereUniqueWithoutProfileInput {

    @Field(() => AccountWhereUniqueInput, {nullable:false})
    @Type(() => AccountWhereUniqueInput)
    where!: Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>;

    @Field(() => AccountUpdateWithoutProfileInput, {nullable:false})
    @Type(() => AccountUpdateWithoutProfileInput)
    data!: AccountUpdateWithoutProfileInput;
}
