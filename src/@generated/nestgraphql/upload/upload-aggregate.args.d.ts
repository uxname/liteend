import { UploadWhereInput } from './upload-where.input';
import { UploadOrderByWithRelationInput } from './upload-order-by-with-relation.input';
import { Prisma } from '@prisma/client';
import { UploadWhereUniqueInput } from './upload-where-unique.input';
import { UploadCountAggregateInput } from './upload-count-aggregate.input';
import { UploadAvgAggregateInput } from './upload-avg-aggregate.input';
import { UploadSumAggregateInput } from './upload-sum-aggregate.input';
import { UploadMinAggregateInput } from './upload-min-aggregate.input';
import { UploadMaxAggregateInput } from './upload-max-aggregate.input';
export declare class UploadAggregateArgs {
    where?: UploadWhereInput;
    orderBy?: Array<UploadOrderByWithRelationInput>;
    cursor?: Prisma.AtLeast<UploadWhereUniqueInput, 'id' | 'filepath'>;
    take?: number;
    skip?: number;
    _count?: UploadCountAggregateInput;
    _avg?: UploadAvgAggregateInput;
    _sum?: UploadSumAggregateInput;
    _min?: UploadMinAggregateInput;
    _max?: UploadMaxAggregateInput;
}
