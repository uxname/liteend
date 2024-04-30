import { UploadCountAggregate } from './upload-count-aggregate.output';
import { UploadAvgAggregate } from './upload-avg-aggregate.output';
import { UploadSumAggregate } from './upload-sum-aggregate.output';
import { UploadMinAggregate } from './upload-min-aggregate.output';
import { UploadMaxAggregate } from './upload-max-aggregate.output';
export declare class AggregateUpload {
    _count?: UploadCountAggregate;
    _avg?: UploadAvgAggregate;
    _sum?: UploadSumAggregate;
    _min?: UploadMinAggregate;
    _max?: UploadMaxAggregate;
}
