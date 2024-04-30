import { OneTimeCodeUpdateInput } from './one-time-code-update.input';
import { Prisma } from '@prisma/client';
import { OneTimeCodeWhereUniqueInput } from './one-time-code-where-unique.input';
export declare class UpdateOneOneTimeCodeArgs {
    data: OneTimeCodeUpdateInput;
    where: Prisma.AtLeast<OneTimeCodeWhereUniqueInput, 'id' | 'email'>;
}
