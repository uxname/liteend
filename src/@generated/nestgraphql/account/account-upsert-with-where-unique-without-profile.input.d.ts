import { Prisma } from '@prisma/client';
import { AccountWhereUniqueInput } from './account-where-unique.input';
import { AccountUpdateWithoutProfileInput } from './account-update-without-profile.input';
import { AccountCreateWithoutProfileInput } from './account-create-without-profile.input';
export declare class AccountUpsertWithWhereUniqueWithoutProfileInput {
    where: Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>;
    update: AccountUpdateWithoutProfileInput;
    create: AccountCreateWithoutProfileInput;
}
