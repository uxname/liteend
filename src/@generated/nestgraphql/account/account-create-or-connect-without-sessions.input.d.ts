import { Prisma } from '@prisma/client';
import { AccountWhereUniqueInput } from './account-where-unique.input';
import { AccountCreateWithoutSessionsInput } from './account-create-without-sessions.input';
export declare class AccountCreateOrConnectWithoutSessionsInput {
    where: Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>;
    create: AccountCreateWithoutSessionsInput;
}
