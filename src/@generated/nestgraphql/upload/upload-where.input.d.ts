import { IntFilter } from '../prisma/int-filter.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { StringFilter } from '../prisma/string-filter.input';
export declare class UploadWhereInput {
    AND?: Array<UploadWhereInput>;
    OR?: Array<UploadWhereInput>;
    NOT?: Array<UploadWhereInput>;
    id?: IntFilter;
    createdAt?: DateTimeFilter;
    updatedAt?: DateTimeFilter;
    filepath?: StringFilter;
    originalFilename?: StringFilter;
    extension?: StringFilter;
    size?: IntFilter;
    mimetype?: StringFilter;
    uploaderIp?: StringFilter;
}
