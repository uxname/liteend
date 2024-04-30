import { IntWithAggregatesFilter } from '../prisma/int-with-aggregates-filter.input';
import { DateTimeWithAggregatesFilter } from '../prisma/date-time-with-aggregates-filter.input';
import { StringWithAggregatesFilter } from '../prisma/string-with-aggregates-filter.input';
export declare class UploadScalarWhereWithAggregatesInput {
    AND?: Array<UploadScalarWhereWithAggregatesInput>;
    OR?: Array<UploadScalarWhereWithAggregatesInput>;
    NOT?: Array<UploadScalarWhereWithAggregatesInput>;
    id?: IntWithAggregatesFilter;
    createdAt?: DateTimeWithAggregatesFilter;
    updatedAt?: DateTimeWithAggregatesFilter;
    filepath?: StringWithAggregatesFilter;
    originalFilename?: StringWithAggregatesFilter;
    extension?: StringWithAggregatesFilter;
    size?: IntWithAggregatesFilter;
    mimetype?: StringWithAggregatesFilter;
    uploaderIp?: StringWithAggregatesFilter;
}
