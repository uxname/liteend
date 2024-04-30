import { Prisma } from '@prisma/client';
import { AccountWhereUniqueInput } from './account-where-unique.input';
import { AccountCreateWithoutProfileInput } from './account-create-without-profile.input';
export declare class AccountCreateOrConnectWithoutProfileInput {
    where: Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>;
    create: AccountCreateWithoutProfileInput;
}
