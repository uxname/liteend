import { Prisma } from '@prisma/client';
import { AccountSessionWhereUniqueInput } from './account-session-where-unique.input';
import { AccountSessionUpdateWithoutAccountInput } from './account-session-update-without-account.input';
export declare class AccountSessionUpdateWithWhereUniqueWithoutAccountInput {
    where: Prisma.AtLeast<AccountSessionWhereUniqueInput, 'id' | 'token'>;
    data: AccountSessionUpdateWithoutAccountInput;
}
