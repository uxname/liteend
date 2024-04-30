import { Prisma } from '@prisma/client';
import { UploadWhereUniqueInput } from './upload-where-unique.input';
export declare class FindUniqueUploadOrThrowArgs {
    where: Prisma.AtLeast<UploadWhereUniqueInput, 'id' | 'filepath'>;
}
