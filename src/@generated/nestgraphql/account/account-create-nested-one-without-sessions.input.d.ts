import { AccountCreateWithoutSessionsInput } from './account-create-without-sessions.input';
import { AccountCreateOrConnectWithoutSessionsInput } from './account-create-or-connect-without-sessions.input';
import { Prisma } from '@prisma/client';
import { AccountWhereUniqueInput } from './account-where-unique.input';
export declare class AccountCreateNestedOneWithoutSessionsInput {
    create?: AccountCreateWithoutSessionsInput;
    connectOrCreate?: AccountCreateOrConnectWithoutSessionsInput;
    connect?: Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>;
}
