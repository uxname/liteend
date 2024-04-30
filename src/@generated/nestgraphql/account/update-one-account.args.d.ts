import { AccountUpdateInput } from './account-update.input';
import { Prisma } from '@prisma/client';
import { AccountWhereUniqueInput } from './account-where-unique.input';
export declare class UpdateOneAccountArgs {
    data: AccountUpdateInput;
    where: Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>;
}
