import { ProfileWhereInput } from './profile-where.input';
import { ProfileOrderByWithRelationInput } from './profile-order-by-with-relation.input';
import { Prisma } from '@prisma/client';
import { ProfileWhereUniqueInput } from './profile-where-unique.input';
import { ProfileScalarFieldEnum } from './profile-scalar-field.enum';
export declare class FindFirstProfileArgs {
    where?: ProfileWhereInput;
    orderBy?: Array<ProfileOrderByWithRelationInput>;
    cursor?: Prisma.AtLeast<ProfileWhereUniqueInput, 'id'>;
    take?: number;
    skip?: number;
    distinct?: Array<keyof typeof ProfileScalarFieldEnum>;
}
