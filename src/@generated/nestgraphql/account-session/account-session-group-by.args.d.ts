import { AccountSessionWhereInput } from './account-session-where.input';
import { AccountSessionOrderByWithAggregationInput } from './account-session-order-by-with-aggregation.input';
import { AccountSessionScalarFieldEnum } from './account-session-scalar-field.enum';
import { AccountSessionScalarWhereWithAggregatesInput } from './account-session-scalar-where-with-aggregates.input';
import { AccountSessionCountAggregateInput } from './account-session-count-aggregate.input';
import { AccountSessionAvgAggregateInput } from './account-session-avg-aggregate.input';
import { AccountSessionSumAggregateInput } from './account-session-sum-aggregate.input';
import { AccountSessionMinAggregateInput } from './account-session-min-aggregate.input';
import { AccountSessionMaxAggregateInput } from './account-session-max-aggregate.input';
export declare class AccountSessionGroupByArgs {
    where?: AccountSessionWhereInput;
    orderBy?: Array<AccountSessionOrderByWithAggregationInput>;
    by: Array<keyof typeof AccountSessionScalarFieldEnum>;
    having?: AccountSessionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AccountSessionCountAggregateInput;
    _avg?: AccountSessionAvgAggregateInput;
    _sum?: AccountSessionSumAggregateInput;
    _min?: AccountSessionMinAggregateInput;
    _max?: AccountSessionMaxAggregateInput;
}
