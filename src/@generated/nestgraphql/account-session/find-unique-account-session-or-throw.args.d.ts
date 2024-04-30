import { Prisma } from '@prisma/client';
import { AccountSessionWhereUniqueInput } from './account-session-where-unique.input';
export declare class FindUniqueAccountSessionOrThrowArgs {
    where: Prisma.AtLeast<AccountSessionWhereUniqueInput, 'id' | 'token'>;
}
