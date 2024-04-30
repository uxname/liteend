import { OneTimeCodeCountAggregate } from './one-time-code-count-aggregate.output';
import { OneTimeCodeAvgAggregate } from './one-time-code-avg-aggregate.output';
import { OneTimeCodeSumAggregate } from './one-time-code-sum-aggregate.output';
import { OneTimeCodeMinAggregate } from './one-time-code-min-aggregate.output';
import { OneTimeCodeMaxAggregate } from './one-time-code-max-aggregate.output';
export declare class OneTimeCodeGroupBy {
    id: number;
    createdAt: Date | string;
    updatedAt: Date | string;
    email: string;
    code: string;
    expiresAt: Date | string;
    _count?: OneTimeCodeCountAggregate;
    _avg?: OneTimeCodeAvgAggregate;
    _sum?: OneTimeCodeSumAggregate;
    _min?: OneTimeCodeMinAggregate;
    _max?: OneTimeCodeMaxAggregate;
}
