import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { ProfileWhereUniqueInput } from './profile-where-unique.input';
import { Type } from 'class-transformer';
import { ProfileCreateWithoutAccountsInput } from './profile-create-without-accounts.input';

@InputType()
export class ProfileCreateOrConnectWithoutAccountsInput {

    @Field(() => ProfileWhereUniqueInput, {nullable:false})
    @Type(() => ProfileWhereUniqueInput)
    where!: Prisma.AtLeast<ProfileWhereUniqueInput, 'id'>;

    @Field(() => ProfileCreateWithoutAccountsInput, {nullable:false})
    @Type(() => ProfileCreateWithoutAccountsInput)
    create!: ProfileCreateWithoutAccountsInput;
}
