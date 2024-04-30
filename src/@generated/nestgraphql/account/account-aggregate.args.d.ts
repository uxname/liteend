import { AccountWhereInput } from './account-where.input';
import { AccountOrderByWithRelationInput } from './account-order-by-with-relation.input';
import { Prisma } from '@prisma/client';
import { AccountWhereUniqueInput } from './account-where-unique.input';
import { AccountCountAggregateInput } from './account-count-aggregate.input';
import { AccountAvgAggregateInput } from './account-avg-aggregate.input';
import { AccountSumAggregateInput } from './account-sum-aggregate.input';
import { AccountMinAggregateInput } from './account-min-aggregate.input';
import { AccountMaxAggregateInput } from './account-max-aggregate.input';
export declare class AccountAggregateArgs {
    where?: AccountWhereInput;
    orderBy?: Array<AccountOrderByWithRelationInput>;
    cursor?: Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>;
    take?: number;
    skip?: number;
    _count?: AccountCountAggregateInput;
    _avg?: AccountAvgAggregateInput;
    _sum?: AccountSumAggregateInput;
    _min?: AccountMinAggregateInput;
    _max?: AccountMaxAggregateInput;
}
