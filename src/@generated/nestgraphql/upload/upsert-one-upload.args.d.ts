import { Prisma } from '@prisma/client';
import { UploadWhereUniqueInput } from './upload-where-unique.input';
import { UploadCreateInput } from './upload-create.input';
import { UploadUpdateInput } from './upload-update.input';
export declare class UpsertOneUploadArgs {
    where: Prisma.AtLeast<UploadWhereUniqueInput, 'id' | 'filepath'>;
    create: UploadCreateInput;
    update: UploadUpdateInput;
}
