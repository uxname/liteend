import { AccountWhereInput } from './account-where.input';
import { AccountOrderByWithAggregationInput } from './account-order-by-with-aggregation.input';
import { AccountScalarFieldEnum } from './account-scalar-field.enum';
import { AccountScalarWhereWithAggregatesInput } from './account-scalar-where-with-aggregates.input';
import { AccountCountAggregateInput } from './account-count-aggregate.input';
import { AccountAvgAggregateInput } from './account-avg-aggregate.input';
import { AccountSumAggregateInput } from './account-sum-aggregate.input';
import { AccountMinAggregateInput } from './account-min-aggregate.input';
import { AccountMaxAggregateInput } from './account-max-aggregate.input';
export declare class AccountGroupByArgs {
    where?: AccountWhereInput;
    orderBy?: Array<AccountOrderByWithAggregationInput>;
    by: Array<keyof typeof AccountScalarFieldEnum>;
    having?: AccountScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AccountCountAggregateInput;
    _avg?: AccountAvgAggregateInput;
    _sum?: AccountSumAggregateInput;
    _min?: AccountMinAggregateInput;
    _max?: AccountMaxAggregateInput;
}
