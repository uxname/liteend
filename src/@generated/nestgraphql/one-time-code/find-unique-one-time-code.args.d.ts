import { Prisma } from '@prisma/client';
import { OneTimeCodeWhereUniqueInput } from './one-time-code-where-unique.input';
export declare class FindUniqueOneTimeCodeArgs {
    where: Prisma.AtLeast<OneTimeCodeWhereUniqueInput, 'id' | 'email'>;
}
