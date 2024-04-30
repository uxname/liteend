import { Prisma } from '@prisma/client';
import { AccountWhereUniqueInput } from './account-where-unique.input';
export declare class DeleteOneAccountArgs {
    where: Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>;
}
