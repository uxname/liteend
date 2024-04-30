import { AccountSessionCreateWithoutAccountInput } from './account-session-create-without-account.input';
import { AccountSessionCreateOrConnectWithoutAccountInput } from './account-session-create-or-connect-without-account.input';
import { AccountSessionCreateManyAccountInputEnvelope } from './account-session-create-many-account-input-envelope.input';
import { Prisma } from '@prisma/client';
import { AccountSessionWhereUniqueInput } from './account-session-where-unique.input';
export declare class AccountSessionCreateNestedManyWithoutAccountInput {
    create?: Array<AccountSessionCreateWithoutAccountInput>;
    connectOrCreate?: Array<AccountSessionCreateOrConnectWithoutAccountInput>;
    createMany?: AccountSessionCreateManyAccountInputEnvelope;
    connect?: Array<Prisma.AtLeast<AccountSessionWhereUniqueInput, 'id' | 'token'>>;
}
