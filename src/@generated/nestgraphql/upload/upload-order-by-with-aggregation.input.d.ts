import { SortOrder } from '../prisma/sort-order.enum';
import { UploadCountOrderByAggregateInput } from './upload-count-order-by-aggregate.input';
import { UploadAvgOrderByAggregateInput } from './upload-avg-order-by-aggregate.input';
import { UploadMaxOrderByAggregateInput } from './upload-max-order-by-aggregate.input';
import { UploadMinOrderByAggregateInput } from './upload-min-order-by-aggregate.input';
import { UploadSumOrderByAggregateInput } from './upload-sum-order-by-aggregate.input';
export declare class UploadOrderByWithAggregationInput {
    id?: keyof typeof SortOrder;
    createdAt?: keyof typeof SortOrder;
    updatedAt?: keyof typeof SortOrder;
    filepath?: keyof typeof SortOrder;
    originalFilename?: keyof typeof SortOrder;
    extension?: keyof typeof SortOrder;
    size?: keyof typeof SortOrder;
    mimetype?: keyof typeof SortOrder;
    uploaderIp?: keyof typeof SortOrder;
    _count?: UploadCountOrderByAggregateInput;
    _avg?: UploadAvgOrderByAggregateInput;
    _max?: UploadMaxOrderByAggregateInput;
    _min?: UploadMinOrderByAggregateInput;
    _sum?: UploadSumOrderByAggregateInput;
}
