import { AccountCreateWithoutProfileInput } from './account-create-without-profile.input';
import { AccountCreateOrConnectWithoutProfileInput } from './account-create-or-connect-without-profile.input';
import { AccountCreateManyProfileInputEnvelope } from './account-create-many-profile-input-envelope.input';
import { Prisma } from '@prisma/client';
import { AccountWhereUniqueInput } from './account-where-unique.input';
export declare class AccountUncheckedCreateNestedManyWithoutProfileInput {
    create?: Array<AccountCreateWithoutProfileInput>;
    connectOrCreate?: Array<AccountCreateOrConnectWithoutProfileInput>;
    createMany?: AccountCreateManyProfileInputEnvelope;
    connect?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>>;
}
