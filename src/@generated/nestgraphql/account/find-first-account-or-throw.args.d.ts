import { AccountWhereInput } from './account-where.input';
import { AccountOrderByWithRelationInput } from './account-order-by-with-relation.input';
import { Prisma } from '@prisma/client';
import { AccountWhereUniqueInput } from './account-where-unique.input';
import { AccountScalarFieldEnum } from './account-scalar-field.enum';
export declare class FindFirstAccountOrThrowArgs {
    where?: AccountWhereInput;
    orderBy?: Array<AccountOrderByWithRelationInput>;
    cursor?: Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>;
    take?: number;
    skip?: number;
    distinct?: Array<keyof typeof AccountScalarFieldEnum>;
}
