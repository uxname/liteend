import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { AccountSessionWhereInput } from './account-session-where.input';
import { Type } from 'class-transformer';
import { AccountSessionOrderByWithRelationInput } from './account-session-order-by-with-relation.input';
import { Prisma } from '@prisma/client';
import { AccountSessionWhereUniqueInput } from './account-session-where-unique.input';
import { Int } from '@nestjs/graphql';
import { AccountSessionCountAggregateInput } from './account-session-count-aggregate.input';
import { AccountSessionAvgAggregateInput } from './account-session-avg-aggregate.input';
import { AccountSessionSumAggregateInput } from './account-session-sum-aggregate.input';
import { AccountSessionMinAggregateInput } from './account-session-min-aggregate.input';
import { AccountSessionMaxAggregateInput } from './account-session-max-aggregate.input';

@ArgsType()
export class AccountSessionAggregateArgs {

    @Field(() => AccountSessionWhereInput, {nullable:true})
    @Type(() => AccountSessionWhereInput)
    where?: AccountSessionWhereInput;

    @Field(() => [AccountSessionOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<AccountSessionOrderByWithRelationInput>;

    @Field(() => AccountSessionWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<AccountSessionWhereUniqueInput, 'id' | 'token'>;

    @Field(() => Int, {nullable:true})
    take?: number;

    @Field(() => Int, {nullable:true})
    skip?: number;

    @Field(() => AccountSessionCountAggregateInput, {nullable:true})
    _count?: AccountSessionCountAggregateInput;

    @Field(() => AccountSessionAvgAggregateInput, {nullable:true})
    _avg?: AccountSessionAvgAggregateInput;

    @Field(() => AccountSessionSumAggregateInput, {nullable:true})
    _sum?: AccountSessionSumAggregateInput;

    @Field(() => AccountSessionMinAggregateInput, {nullable:true})
    _min?: AccountSessionMinAggregateInput;

    @Field(() => AccountSessionMaxAggregateInput, {nullable:true})
    _max?: AccountSessionMaxAggregateInput;
}
