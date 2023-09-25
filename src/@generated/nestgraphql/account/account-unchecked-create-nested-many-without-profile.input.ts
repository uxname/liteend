import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountCreateWithoutProfileInput } from './account-create-without-profile.input';
import { Type } from 'class-transformer';
import { AccountCreateOrConnectWithoutProfileInput } from './account-create-or-connect-without-profile.input';
import { AccountCreateManyProfileInputEnvelope } from './account-create-many-profile-input-envelope.input';
import { Prisma } from '@prisma/client';
import { AccountWhereUniqueInput } from './account-where-unique.input';

@InputType()
export class AccountUncheckedCreateNestedManyWithoutProfileInput {

    @Field(() => [AccountCreateWithoutProfileInput], {nullable:true})
    @Type(() => AccountCreateWithoutProfileInput)
    create?: Array<AccountCreateWithoutProfileInput>;

    @Field(() => [AccountCreateOrConnectWithoutProfileInput], {nullable:true})
    @Type(() => AccountCreateOrConnectWithoutProfileInput)
    connectOrCreate?: Array<AccountCreateOrConnectWithoutProfileInput>;

    @Field(() => AccountCreateManyProfileInputEnvelope, {nullable:true})
    @Type(() => AccountCreateManyProfileInputEnvelope)
    createMany?: AccountCreateManyProfileInputEnvelope;

    @Field(() => [AccountWhereUniqueInput], {nullable:true})
    @Type(() => AccountWhereUniqueInput)
    connect?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>>;
}
