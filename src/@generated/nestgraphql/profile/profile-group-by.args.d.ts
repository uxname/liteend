import { ProfileWhereInput } from './profile-where.input';
import { ProfileOrderByWithAggregationInput } from './profile-order-by-with-aggregation.input';
import { ProfileScalarFieldEnum } from './profile-scalar-field.enum';
import { ProfileScalarWhereWithAggregatesInput } from './profile-scalar-where-with-aggregates.input';
import { ProfileCountAggregateInput } from './profile-count-aggregate.input';
import { ProfileAvgAggregateInput } from './profile-avg-aggregate.input';
import { ProfileSumAggregateInput } from './profile-sum-aggregate.input';
import { ProfileMinAggregateInput } from './profile-min-aggregate.input';
import { ProfileMaxAggregateInput } from './profile-max-aggregate.input';
export declare class ProfileGroupByArgs {
    where?: ProfileWhereInput;
    orderBy?: Array<ProfileOrderByWithAggregationInput>;
    by: Array<keyof typeof ProfileScalarFieldEnum>;
    having?: ProfileScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProfileCountAggregateInput;
    _avg?: ProfileAvgAggregateInput;
    _sum?: ProfileSumAggregateInput;
    _min?: ProfileMinAggregateInput;
    _max?: ProfileMaxAggregateInput;
}
