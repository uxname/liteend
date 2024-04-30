import { Prisma } from '@prisma/client';
import { AccountSessionWhereUniqueInput } from './account-session-where-unique.input';
import { AccountSessionUpdateWithoutAccountInput } from './account-session-update-without-account.input';
import { AccountSessionCreateWithoutAccountInput } from './account-session-create-without-account.input';
export declare class AccountSessionUpsertWithWhereUniqueWithoutAccountInput {
    where: Prisma.AtLeast<AccountSessionWhereUniqueInput, 'id' | 'token'>;
    update: AccountSessionUpdateWithoutAccountInput;
    create: AccountSessionCreateWithoutAccountInput;
}
