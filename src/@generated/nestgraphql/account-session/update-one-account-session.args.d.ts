import { AccountSessionUpdateInput } from './account-session-update.input';
import { Prisma } from '@prisma/client';
import { AccountSessionWhereUniqueInput } from './account-session-where-unique.input';
export declare class UpdateOneAccountSessionArgs {
    data: AccountSessionUpdateInput;
    where: Prisma.AtLeast<AccountSessionWhereUniqueInput, 'id' | 'token'>;
}
