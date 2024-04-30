import { ProfileWhereInput } from './profile-where.input';
import { ProfileOrderByWithRelationInput } from './profile-order-by-with-relation.input';
import { Prisma } from '@prisma/client';
import { ProfileWhereUniqueInput } from './profile-where-unique.input';
import { ProfileCountAggregateInput } from './profile-count-aggregate.input';
import { ProfileAvgAggregateInput } from './profile-avg-aggregate.input';
import { ProfileSumAggregateInput } from './profile-sum-aggregate.input';
import { ProfileMinAggregateInput } from './profile-min-aggregate.input';
import { ProfileMaxAggregateInput } from './profile-max-aggregate.input';
export declare class ProfileAggregateArgs {
    where?: ProfileWhereInput;
    orderBy?: Array<ProfileOrderByWithRelationInput>;
    cursor?: Prisma.AtLeast<ProfileWhereUniqueInput, 'id'>;
    take?: number;
    skip?: number;
    _count?: ProfileCountAggregateInput;
    _avg?: ProfileAvgAggregateInput;
    _sum?: ProfileSumAggregateInput;
    _min?: ProfileMinAggregateInput;
    _max?: ProfileMaxAggregateInput;
}
