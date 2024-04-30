import { AccountSessionWhereInput } from './account-session-where.input';
import { AccountSessionOrderByWithRelationInput } from './account-session-order-by-with-relation.input';
import { Prisma } from '@prisma/client';
import { AccountSessionWhereUniqueInput } from './account-session-where-unique.input';
import { AccountSessionScalarFieldEnum } from './account-session-scalar-field.enum';
export declare class FindManyAccountSessionArgs {
    where?: AccountSessionWhereInput;
    orderBy?: Array<AccountSessionOrderByWithRelationInput>;
    cursor?: Prisma.AtLeast<AccountSessionWhereUniqueInput, 'id' | 'token'>;
    take?: number;
    skip?: number;
    distinct?: Array<keyof typeof AccountSessionScalarFieldEnum>;
}
