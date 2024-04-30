import { ProfileRole } from '../prisma/profile-role.enum';
import { AccountStatus } from '../prisma/account-status.enum';
import { ProfileCountAggregate } from './profile-count-aggregate.output';
import { ProfileAvgAggregate } from './profile-avg-aggregate.output';
import { ProfileSumAggregate } from './profile-sum-aggregate.output';
import { ProfileMinAggregate } from './profile-min-aggregate.output';
import { ProfileMaxAggregate } from './profile-max-aggregate.output';
export declare class ProfileGroupBy {
    id: number;
    createdAt: Date | string;
    updatedAt: Date | string;
    roles?: Array<keyof typeof ProfileRole>;
    status: keyof typeof AccountStatus;
    avatarUrl?: string;
    name?: string;
    bio?: string;
    totpEnabled: boolean;
    totpSecret?: string;
    _count?: ProfileCountAggregate;
    _avg?: ProfileAvgAggregate;
    _sum?: ProfileSumAggregate;
    _min?: ProfileMinAggregate;
    _max?: ProfileMaxAggregate;
}
