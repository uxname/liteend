import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { OneTimeCodeCountAggregate } from './one-time-code-count-aggregate.output';
import { OneTimeCodeAvgAggregate } from './one-time-code-avg-aggregate.output';
import { OneTimeCodeSumAggregate } from './one-time-code-sum-aggregate.output';
import { OneTimeCodeMinAggregate } from './one-time-code-min-aggregate.output';
import { OneTimeCodeMaxAggregate } from './one-time-code-max-aggregate.output';

@ObjectType()
export class AggregateOneTimeCode {

    @Field(() => OneTimeCodeCountAggregate, {nullable:true})
    _count?: OneTimeCodeCountAggregate;

    @Field(() => OneTimeCodeAvgAggregate, {nullable:true})
    _avg?: OneTimeCodeAvgAggregate;

    @Field(() => OneTimeCodeSumAggregate, {nullable:true})
    _sum?: OneTimeCodeSumAggregate;

    @Field(() => OneTimeCodeMinAggregate, {nullable:true})
    _min?: OneTimeCodeMinAggregate;

    @Field(() => OneTimeCodeMaxAggregate, {nullable:true})
    _max?: OneTimeCodeMaxAggregate;
}
