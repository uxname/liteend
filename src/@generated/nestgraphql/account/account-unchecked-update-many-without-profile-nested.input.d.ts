import { AccountCreateWithoutProfileInput } from './account-create-without-profile.input';
import { AccountCreateOrConnectWithoutProfileInput } from './account-create-or-connect-without-profile.input';
import { AccountUpsertWithWhereUniqueWithoutProfileInput } from './account-upsert-with-where-unique-without-profile.input';
import { AccountCreateManyProfileInputEnvelope } from './account-create-many-profile-input-envelope.input';
import { Prisma } from '@prisma/client';
import { AccountWhereUniqueInput } from './account-where-unique.input';
import { AccountUpdateWithWhereUniqueWithoutProfileInput } from './account-update-with-where-unique-without-profile.input';
import { AccountUpdateManyWithWhereWithoutProfileInput } from './account-update-many-with-where-without-profile.input';
import { AccountScalarWhereInput } from './account-scalar-where.input';
export declare class AccountUncheckedUpdateManyWithoutProfileNestedInput {
    create?: Array<AccountCreateWithoutProfileInput>;
    connectOrCreate?: Array<AccountCreateOrConnectWithoutProfileInput>;
    upsert?: Array<AccountUpsertWithWhereUniqueWithoutProfileInput>;
    createMany?: AccountCreateManyProfileInputEnvelope;
    set?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>>;
    disconnect?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>>;
    delete?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>>;
    connect?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>>;
    update?: Array<AccountUpdateWithWhereUniqueWithoutProfileInput>;
    updateMany?: Array<AccountUpdateManyWithWhereWithoutProfileInput>;
    deleteMany?: Array<AccountScalarWhereInput>;
}
