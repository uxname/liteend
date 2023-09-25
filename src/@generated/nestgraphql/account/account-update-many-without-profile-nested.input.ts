import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountCreateWithoutProfileInput } from './account-create-without-profile.input';
import { Type } from 'class-transformer';
import { AccountCreateOrConnectWithoutProfileInput } from './account-create-or-connect-without-profile.input';
import { AccountUpsertWithWhereUniqueWithoutProfileInput } from './account-upsert-with-where-unique-without-profile.input';
import { AccountCreateManyProfileInputEnvelope } from './account-create-many-profile-input-envelope.input';
import { Prisma } from '@prisma/client';
import { AccountWhereUniqueInput } from './account-where-unique.input';
import { AccountUpdateWithWhereUniqueWithoutProfileInput } from './account-update-with-where-unique-without-profile.input';
import { AccountUpdateManyWithWhereWithoutProfileInput } from './account-update-many-with-where-without-profile.input';
import { AccountScalarWhereInput } from './account-scalar-where.input';

@InputType()
export class AccountUpdateManyWithoutProfileNestedInput {

    @Field(() => [AccountCreateWithoutProfileInput], {nullable:true})
    @Type(() => AccountCreateWithoutProfileInput)
    create?: Array<AccountCreateWithoutProfileInput>;

    @Field(() => [AccountCreateOrConnectWithoutProfileInput], {nullable:true})
    @Type(() => AccountCreateOrConnectWithoutProfileInput)
    connectOrCreate?: Array<AccountCreateOrConnectWithoutProfileInput>;

    @Field(() => [AccountUpsertWithWhereUniqueWithoutProfileInput], {nullable:true})
    @Type(() => AccountUpsertWithWhereUniqueWithoutProfileInput)
    upsert?: Array<AccountUpsertWithWhereUniqueWithoutProfileInput>;

    @Field(() => AccountCreateManyProfileInputEnvelope, {nullable:true})
    @Type(() => AccountCreateManyProfileInputEnvelope)
    createMany?: AccountCreateManyProfileInputEnvelope;

    @Field(() => [AccountWhereUniqueInput], {nullable:true})
    @Type(() => AccountWhereUniqueInput)
    set?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>>;

    @Field(() => [AccountWhereUniqueInput], {nullable:true})
    @Type(() => AccountWhereUniqueInput)
    disconnect?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>>;

    @Field(() => [AccountWhereUniqueInput], {nullable:true})
    @Type(() => AccountWhereUniqueInput)
    delete?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>>;

    @Field(() => [AccountWhereUniqueInput], {nullable:true})
    @Type(() => AccountWhereUniqueInput)
    connect?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>>;

    @Field(() => [AccountUpdateWithWhereUniqueWithoutProfileInput], {nullable:true})
    @Type(() => AccountUpdateWithWhereUniqueWithoutProfileInput)
    update?: Array<AccountUpdateWithWhereUniqueWithoutProfileInput>;

    @Field(() => [AccountUpdateManyWithWhereWithoutProfileInput], {nullable:true})
    @Type(() => AccountUpdateManyWithWhereWithoutProfileInput)
    updateMany?: Array<AccountUpdateManyWithWhereWithoutProfileInput>;

    @Field(() => [AccountScalarWhereInput], {nullable:true})
    @Type(() => AccountScalarWhereInput)
    deleteMany?: Array<AccountScalarWhereInput>;
}
