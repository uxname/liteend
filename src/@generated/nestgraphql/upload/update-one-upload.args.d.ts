import { UploadUpdateInput } from './upload-update.input';
import { Prisma } from '@prisma/client';
import { UploadWhereUniqueInput } from './upload-where-unique.input';
export declare class UpdateOneUploadArgs {
    data: UploadUpdateInput;
    where: Prisma.AtLeast<UploadWhereUniqueInput, 'id' | 'filepath'>;
}
