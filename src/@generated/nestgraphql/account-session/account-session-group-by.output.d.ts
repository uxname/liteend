import { AccountSessionCountAggregate } from './account-session-count-aggregate.output';
import { AccountSessionAvgAggregate } from './account-session-avg-aggregate.output';
import { AccountSessionSumAggregate } from './account-session-sum-aggregate.output';
import { AccountSessionMinAggregate } from './account-session-min-aggregate.output';
import { AccountSessionMaxAggregate } from './account-session-max-aggregate.output';
export declare class AccountSessionGroupBy {
    id: number;
    createdAt: Date | string;
    updatedAt: Date | string;
    accountId: number;
    token: string;
    ipAddr: string;
    userAgent?: string;
    expiresAt: Date | string;
    _count?: AccountSessionCountAggregate;
    _avg?: AccountSessionAvgAggregate;
    _sum?: AccountSessionSumAggregate;
    _min?: AccountSessionMinAggregate;
    _max?: AccountSessionMaxAggregate;
}
