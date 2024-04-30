import { UploadCountAggregate } from './upload-count-aggregate.output';
import { UploadAvgAggregate } from './upload-avg-aggregate.output';
import { UploadSumAggregate } from './upload-sum-aggregate.output';
import { UploadMinAggregate } from './upload-min-aggregate.output';
import { UploadMaxAggregate } from './upload-max-aggregate.output';
export declare class UploadGroupBy {
    id: number;
    createdAt: Date | string;
    updatedAt: Date | string;
    filepath: string;
    originalFilename: string;
    extension: string;
    size: number;
    mimetype: string;
    uploaderIp: string;
    _count?: UploadCountAggregate;
    _avg?: UploadAvgAggregate;
    _sum?: UploadSumAggregate;
    _min?: UploadMinAggregate;
    _max?: UploadMaxAggregate;
}
