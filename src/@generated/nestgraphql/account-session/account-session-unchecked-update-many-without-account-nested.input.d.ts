import { AccountSessionCreateWithoutAccountInput } from './account-session-create-without-account.input';
import { AccountSessionCreateOrConnectWithoutAccountInput } from './account-session-create-or-connect-without-account.input';
import { AccountSessionUpsertWithWhereUniqueWithoutAccountInput } from './account-session-upsert-with-where-unique-without-account.input';
import { AccountSessionCreateManyAccountInputEnvelope } from './account-session-create-many-account-input-envelope.input';
import { Prisma } from '@prisma/client';
import { AccountSessionWhereUniqueInput } from './account-session-where-unique.input';
import { AccountSessionUpdateWithWhereUniqueWithoutAccountInput } from './account-session-update-with-where-unique-without-account.input';
import { AccountSessionUpdateManyWithWhereWithoutAccountInput } from './account-session-update-many-with-where-without-account.input';
import { AccountSessionScalarWhereInput } from './account-session-scalar-where.input';
export declare class AccountSessionUncheckedUpdateManyWithoutAccountNestedInput {
    create?: Array<AccountSessionCreateWithoutAccountInput>;
    connectOrCreate?: Array<AccountSessionCreateOrConnectWithoutAccountInput>;
    upsert?: Array<AccountSessionUpsertWithWhereUniqueWithoutAccountInput>;
    createMany?: AccountSessionCreateManyAccountInputEnvelope;
    set?: Array<Prisma.AtLeast<AccountSessionWhereUniqueInput, 'id' | 'token'>>;
    disconnect?: Array<Prisma.AtLeast<AccountSessionWhereUniqueInput, 'id' | 'token'>>;
    delete?: Array<Prisma.AtLeast<AccountSessionWhereUniqueInput, 'id' | 'token'>>;
    connect?: Array<Prisma.AtLeast<AccountSessionWhereUniqueInput, 'id' | 'token'>>;
    update?: Array<AccountSessionUpdateWithWhereUniqueWithoutAccountInput>;
    updateMany?: Array<AccountSessionUpdateManyWithWhereWithoutAccountInput>;
    deleteMany?: Array<AccountSessionScalarWhereInput>;
}
