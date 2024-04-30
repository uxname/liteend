import { Prisma } from '@prisma/client';
import { AccountWhereUniqueInput } from './account-where-unique.input';
import { AccountCreateInput } from './account-create.input';
import { AccountUpdateInput } from './account-update.input';
export declare class UpsertOneAccountArgs {
    where: Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>;
    create: AccountCreateInput;
    update: AccountUpdateInput;
}
