import { AccountSessionWhereInput } from './account-session-where.input';
import { AccountSessionOrderByWithRelationInput } from './account-session-order-by-with-relation.input';
import { Prisma } from '@prisma/client';
import { AccountSessionWhereUniqueInput } from './account-session-where-unique.input';
import { AccountSessionCountAggregateInput } from './account-session-count-aggregate.input';
import { AccountSessionAvgAggregateInput } from './account-session-avg-aggregate.input';
import { AccountSessionSumAggregateInput } from './account-session-sum-aggregate.input';
import { AccountSessionMinAggregateInput } from './account-session-min-aggregate.input';
import { AccountSessionMaxAggregateInput } from './account-session-max-aggregate.input';
export declare class AccountSessionAggregateArgs {
    where?: AccountSessionWhereInput;
    orderBy?: Array<AccountSessionOrderByWithRelationInput>;
    cursor?: Prisma.AtLeast<AccountSessionWhereUniqueInput, 'id' | 'token'>;
    take?: number;
    skip?: number;
    _count?: AccountSessionCountAggregateInput;
    _avg?: AccountSessionAvgAggregateInput;
    _sum?: AccountSessionSumAggregateInput;
    _min?: AccountSessionMinAggregateInput;
    _max?: AccountSessionMaxAggregateInput;
}
