import { OneTimeCodeWhereInput } from './one-time-code-where.input';
import { OneTimeCodeOrderByWithRelationInput } from './one-time-code-order-by-with-relation.input';
import { Prisma } from '@prisma/client';
import { OneTimeCodeWhereUniqueInput } from './one-time-code-where-unique.input';
import { OneTimeCodeScalarFieldEnum } from './one-time-code-scalar-field.enum';
export declare class FindManyOneTimeCodeArgs {
    where?: OneTimeCodeWhereInput;
    orderBy?: Array<OneTimeCodeOrderByWithRelationInput>;
    cursor?: Prisma.AtLeast<OneTimeCodeWhereUniqueInput, 'id' | 'email'>;
    take?: number;
    skip?: number;
    distinct?: Array<keyof typeof OneTimeCodeScalarFieldEnum>;
}
