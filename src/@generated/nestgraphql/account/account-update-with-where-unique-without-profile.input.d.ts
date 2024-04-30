import { Prisma } from '@prisma/client';
import { AccountWhereUniqueInput } from './account-where-unique.input';
import { AccountUpdateWithoutProfileInput } from './account-update-without-profile.input';
export declare class AccountUpdateWithWhereUniqueWithoutProfileInput {
    where: Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>;
    data: AccountUpdateWithoutProfileInput;
}
