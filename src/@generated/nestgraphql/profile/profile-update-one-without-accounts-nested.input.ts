import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ProfileCreateWithoutAccountsInput } from './profile-create-without-accounts.input';
import { Type } from 'class-transformer';
import { ProfileCreateOrConnectWithoutAccountsInput } from './profile-create-or-connect-without-accounts.input';
import { ProfileUpsertWithoutAccountsInput } from './profile-upsert-without-accounts.input';
import { ProfileWhereInput } from './profile-where.input';
import { Prisma } from '@prisma/client';
import { ProfileWhereUniqueInput } from './profile-where-unique.input';
import { ProfileUpdateToOneWithWhereWithoutAccountsInput } from './profile-update-to-one-with-where-without-accounts.input';

@InputType()
export class ProfileUpdateOneWithoutAccountsNestedInput {

    @Field(() => ProfileCreateWithoutAccountsInput, {nullable:true})
    @Type(() => ProfileCreateWithoutAccountsInput)
    create?: ProfileCreateWithoutAccountsInput;

    @Field(() => ProfileCreateOrConnectWithoutAccountsInput, {nullable:true})
    @Type(() => ProfileCreateOrConnectWithoutAccountsInput)
    connectOrCreate?: ProfileCreateOrConnectWithoutAccountsInput;

    @Field(() => ProfileUpsertWithoutAccountsInput, {nullable:true})
    @Type(() => ProfileUpsertWithoutAccountsInput)
    upsert?: ProfileUpsertWithoutAccountsInput;

    @Field(() => ProfileWhereInput, {nullable:true})
    @Type(() => ProfileWhereInput)
    disconnect?: ProfileWhereInput;

    @Field(() => ProfileWhereInput, {nullable:true})
    @Type(() => ProfileWhereInput)
    delete?: ProfileWhereInput;

    @Field(() => ProfileWhereUniqueInput, {nullable:true})
    @Type(() => ProfileWhereUniqueInput)
    connect?: Prisma.AtLeast<ProfileWhereUniqueInput, 'id'>;

    @Field(() => ProfileUpdateToOneWithWhereWithoutAccountsInput, {nullable:true})
    @Type(() => ProfileUpdateToOneWithWhereWithoutAccountsInput)
    update?: ProfileUpdateToOneWithWhereWithoutAccountsInput;
}
