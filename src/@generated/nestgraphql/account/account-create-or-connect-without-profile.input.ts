import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { AccountWhereUniqueInput } from './account-where-unique.input';
import { Type } from 'class-transformer';
import { AccountCreateWithoutProfileInput } from './account-create-without-profile.input';

@InputType()
export class AccountCreateOrConnectWithoutProfileInput {

    @Field(() => AccountWhereUniqueInput, {nullable:false})
    @Type(() => AccountWhereUniqueInput)
    where!: Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>;

    @Field(() => AccountCreateWithoutProfileInput, {nullable:false})
    @Type(() => AccountCreateWithoutProfileInput)
    create!: AccountCreateWithoutProfileInput;
}
