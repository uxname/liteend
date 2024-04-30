import { OneTimeCodeWhereInput } from './one-time-code-where.input';
import { OneTimeCodeOrderByWithRelationInput } from './one-time-code-order-by-with-relation.input';
import { Prisma } from '@prisma/client';
import { OneTimeCodeWhereUniqueInput } from './one-time-code-where-unique.input';
import { OneTimeCodeCountAggregateInput } from './one-time-code-count-aggregate.input';
import { OneTimeCodeAvgAggregateInput } from './one-time-code-avg-aggregate.input';
import { OneTimeCodeSumAggregateInput } from './one-time-code-sum-aggregate.input';
import { OneTimeCodeMinAggregateInput } from './one-time-code-min-aggregate.input';
import { OneTimeCodeMaxAggregateInput } from './one-time-code-max-aggregate.input';
export declare class OneTimeCodeAggregateArgs {
    where?: OneTimeCodeWhereInput;
    orderBy?: Array<OneTimeCodeOrderByWithRelationInput>;
    cursor?: Prisma.AtLeast<OneTimeCodeWhereUniqueInput, 'id' | 'email'>;
    take?: number;
    skip?: number;
    _count?: OneTimeCodeCountAggregateInput;
    _avg?: OneTimeCodeAvgAggregateInput;
    _sum?: OneTimeCodeSumAggregateInput;
    _min?: OneTimeCodeMinAggregateInput;
    _max?: OneTimeCodeMaxAggregateInput;
}
