import { UploadWhereInput } from './upload-where.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { StringFilter } from '../prisma/string-filter.input';
import { IntFilter } from '../prisma/int-filter.input';
export declare class UploadWhereUniqueInput {
    id?: number;
    filepath?: string;
    AND?: Array<UploadWhereInput>;
    OR?: Array<UploadWhereInput>;
    NOT?: Array<UploadWhereInput>;
    createdAt?: DateTimeFilter;
    updatedAt?: DateTimeFilter;
    originalFilename?: StringFilter;
    extension?: StringFilter;
    size?: IntFilter;
    mimetype?: StringFilter;
    uploaderIp?: StringFilter;
}
