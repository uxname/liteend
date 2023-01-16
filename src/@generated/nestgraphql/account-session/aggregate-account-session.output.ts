import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { AccountSessionCountAggregate } from './account-session-count-aggregate.output';
import { AccountSessionAvgAggregate } from './account-session-avg-aggregate.output';
import { AccountSessionSumAggregate } from './account-session-sum-aggregate.output';
import { AccountSessionMinAggregate } from './account-session-min-aggregate.output';
import { AccountSessionMaxAggregate } from './account-session-max-aggregate.output';

@ObjectType()
export class AggregateAccountSession {

    @Field(() => AccountSessionCountAggregate, {nullable:true})
    _count?: AccountSessionCountAggregate;

    @Field(() => AccountSessionAvgAggregate, {nullable:true})
    _avg?: AccountSessionAvgAggregate;

    @Field(() => AccountSessionSumAggregate, {nullable:true})
    _sum?: AccountSessionSumAggregate;

    @Field(() => AccountSessionMinAggregate, {nullable:true})
    _min?: AccountSessionMinAggregate;

    @Field(() => AccountSessionMaxAggregate, {nullable:true})
    _max?: AccountSessionMaxAggregate;
}
