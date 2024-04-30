import { Prisma } from '@prisma/client';
import { AccountSessionWhereUniqueInput } from './account-session-where-unique.input';
import { AccountSessionCreateInput } from './account-session-create.input';
import { AccountSessionUpdateInput } from './account-session-update.input';
export declare class UpsertOneAccountSessionArgs {
    where: Prisma.AtLeast<AccountSessionWhereUniqueInput, 'id' | 'token'>;
    create: AccountSessionCreateInput;
    update: AccountSessionUpdateInput;
}
