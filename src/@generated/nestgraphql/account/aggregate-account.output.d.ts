import { AccountCountAggregate } from './account-count-aggregate.output';
import { AccountAvgAggregate } from './account-avg-aggregate.output';
import { AccountSumAggregate } from './account-sum-aggregate.output';
import { AccountMinAggregate } from './account-min-aggregate.output';
import { AccountMaxAggregate } from './account-max-aggregate.output';
export declare class AggregateAccount {
    _count?: AccountCountAggregate;
    _avg?: AccountAvgAggregate;
    _sum?: AccountSumAggregate;
    _min?: AccountMinAggregate;
    _max?: AccountMaxAggregate;
}
