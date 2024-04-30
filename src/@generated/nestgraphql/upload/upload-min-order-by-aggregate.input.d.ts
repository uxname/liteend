import { SortOrder } from '../prisma/sort-order.enum';
export declare class UploadMinOrderByAggregateInput {
    id?: keyof typeof SortOrder;
    createdAt?: keyof typeof SortOrder;
    updatedAt?: keyof typeof SortOrder;
    filepath?: keyof typeof SortOrder;
    originalFilename?: keyof typeof SortOrder;
    extension?: keyof typeof SortOrder;
    size?: keyof typeof SortOrder;
    mimetype?: keyof typeof SortOrder;
    uploaderIp?: keyof typeof SortOrder;
}
