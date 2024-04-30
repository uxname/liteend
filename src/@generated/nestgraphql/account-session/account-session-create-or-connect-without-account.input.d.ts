import { Prisma } from '@prisma/client';
import { AccountSessionWhereUniqueInput } from './account-session-where-unique.input';
import { AccountSessionCreateWithoutAccountInput } from './account-session-create-without-account.input';
export declare class AccountSessionCreateOrConnectWithoutAccountInput {
    where: Prisma.AtLeast<AccountSessionWhereUniqueInput, 'id' | 'token'>;
    create: AccountSessionCreateWithoutAccountInput;
}
