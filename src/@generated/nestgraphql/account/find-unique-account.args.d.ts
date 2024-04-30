import { Prisma } from '@prisma/client';
import { AccountWhereUniqueInput } from './account-where-unique.input';
export declare class FindUniqueAccountArgs {
    where: Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>;
}
