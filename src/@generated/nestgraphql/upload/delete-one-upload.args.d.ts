import { Prisma } from '@prisma/client';
import { UploadWhereUniqueInput } from './upload-where-unique.input';
export declare class DeleteOneUploadArgs {
    where: Prisma.AtLeast<UploadWhereUniqueInput, 'id' | 'filepath'>;
}
