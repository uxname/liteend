import { UploadWhereInput } from './upload-where.input';
import { UploadOrderByWithAggregationInput } from './upload-order-by-with-aggregation.input';
import { UploadScalarFieldEnum } from './upload-scalar-field.enum';
import { UploadScalarWhereWithAggregatesInput } from './upload-scalar-where-with-aggregates.input';
import { UploadCountAggregateInput } from './upload-count-aggregate.input';
import { UploadAvgAggregateInput } from './upload-avg-aggregate.input';
import { UploadSumAggregateInput } from './upload-sum-aggregate.input';
import { UploadMinAggregateInput } from './upload-min-aggregate.input';
import { UploadMaxAggregateInput } from './upload-max-aggregate.input';
export declare class UploadGroupByArgs {
    where?: UploadWhereInput;
    orderBy?: Array<UploadOrderByWithAggregationInput>;
    by: Array<keyof typeof UploadScalarFieldEnum>;
    having?: UploadScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UploadCountAggregateInput;
    _avg?: UploadAvgAggregateInput;
    _sum?: UploadSumAggregateInput;
    _min?: UploadMinAggregateInput;
    _max?: UploadMaxAggregateInput;
}
