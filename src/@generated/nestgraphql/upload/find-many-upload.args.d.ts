import { UploadWhereInput } from './upload-where.input';
import { UploadOrderByWithRelationInput } from './upload-order-by-with-relation.input';
import { Prisma } from '@prisma/client';
import { UploadWhereUniqueInput } from './upload-where-unique.input';
import { UploadScalarFieldEnum } from './upload-scalar-field.enum';
export declare class FindManyUploadArgs {
    where?: UploadWhereInput;
    orderBy?: Array<UploadOrderByWithRelationInput>;
    cursor?: Prisma.AtLeast<UploadWhereUniqueInput, 'id' | 'filepath'>;
    take?: number;
    skip?: number;
    distinct?: Array<keyof typeof UploadScalarFieldEnum>;
}
