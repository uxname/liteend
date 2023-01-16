import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { AccountCountAggregate } from './account-count-aggregate.output';
import { AccountAvgAggregate } from './account-avg-aggregate.output';
import { AccountSumAggregate } from './account-sum-aggregate.output';
import { AccountMinAggregate } from './account-min-aggregate.output';
import { AccountMaxAggregate } from './account-max-aggregate.output';

@ObjectType()
export class AggregateAccount {

    @Field(() => AccountCountAggregate, {nullable:true})
    _count?: AccountCountAggregate;

    @Field(() => AccountAvgAggregate, {nullable:true})
    _avg?: AccountAvgAggregate;

    @Field(() => AccountSumAggregate, {nullable:true})
    _sum?: AccountSumAggregate;

    @Field(() => AccountMinAggregate, {nullable:true})
    _min?: AccountMinAggregate;

    @Field(() => AccountMaxAggregate, {nullable:true})
    _max?: AccountMaxAggregate;
}
