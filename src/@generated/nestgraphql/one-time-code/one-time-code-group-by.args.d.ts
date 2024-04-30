import { OneTimeCodeWhereInput } from './one-time-code-where.input';
import { OneTimeCodeOrderByWithAggregationInput } from './one-time-code-order-by-with-aggregation.input';
import { OneTimeCodeScalarFieldEnum } from './one-time-code-scalar-field.enum';
import { OneTimeCodeScalarWhereWithAggregatesInput } from './one-time-code-scalar-where-with-aggregates.input';
import { OneTimeCodeCountAggregateInput } from './one-time-code-count-aggregate.input';
import { OneTimeCodeAvgAggregateInput } from './one-time-code-avg-aggregate.input';
import { OneTimeCodeSumAggregateInput } from './one-time-code-sum-aggregate.input';
import { OneTimeCodeMinAggregateInput } from './one-time-code-min-aggregate.input';
import { OneTimeCodeMaxAggregateInput } from './one-time-code-max-aggregate.input';
export declare class OneTimeCodeGroupByArgs {
    where?: OneTimeCodeWhereInput;
    orderBy?: Array<OneTimeCodeOrderByWithAggregationInput>;
    by: Array<keyof typeof OneTimeCodeScalarFieldEnum>;
    having?: OneTimeCodeScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OneTimeCodeCountAggregateInput;
    _avg?: OneTimeCodeAvgAggregateInput;
    _sum?: OneTimeCodeSumAggregateInput;
    _min?: OneTimeCodeMinAggregateInput;
    _max?: OneTimeCodeMaxAggregateInput;
}
