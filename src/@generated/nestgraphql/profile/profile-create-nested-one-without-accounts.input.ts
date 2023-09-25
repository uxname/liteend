import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ProfileCreateWithoutAccountsInput } from './profile-create-without-accounts.input';
import { Type } from 'class-transformer';
import { ProfileCreateOrConnectWithoutAccountsInput } from './profile-create-or-connect-without-accounts.input';
import { Prisma } from '@prisma/client';
import { ProfileWhereUniqueInput } from './profile-where-unique.input';

@InputType()
export class ProfileCreateNestedOneWithoutAccountsInput {

    @Field(() => ProfileCreateWithoutAccountsInput, {nullable:true})
    @Type(() => ProfileCreateWithoutAccountsInput)
    create?: ProfileCreateWithoutAccountsInput;

    @Field(() => ProfileCreateOrConnectWithoutAccountsInput, {nullable:true})
    @Type(() => ProfileCreateOrConnectWithoutAccountsInput)
    connectOrCreate?: ProfileCreateOrConnectWithoutAccountsInput;

    @Field(() => ProfileWhereUniqueInput, {nullable:true})
    @Type(() => ProfileWhereUniqueInput)
    connect?: Prisma.AtLeast<ProfileWhereUniqueInput, 'id'>;
}
