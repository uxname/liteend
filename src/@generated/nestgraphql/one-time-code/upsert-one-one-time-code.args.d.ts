import { Prisma } from '@prisma/client';
import { OneTimeCodeWhereUniqueInput } from './one-time-code-where-unique.input';
import { OneTimeCodeCreateInput } from './one-time-code-create.input';
import { OneTimeCodeUpdateInput } from './one-time-code-update.input';
export declare class UpsertOneOneTimeCodeArgs {
    where: Prisma.AtLeast<OneTimeCodeWhereUniqueInput, 'id' | 'email'>;
    create: OneTimeCodeCreateInput;
    update: OneTimeCodeUpdateInput;
}
