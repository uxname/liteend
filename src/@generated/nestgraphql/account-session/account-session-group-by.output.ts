import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { HideField } from '@nestjs/graphql';
import { AccountSessionCountAggregate } from './account-session-count-aggregate.output';
import { AccountSessionAvgAggregate } from './account-session-avg-aggregate.output';
import { AccountSessionSumAggregate } from './account-session-sum-aggregate.output';
import { AccountSessionMinAggregate } from './account-session-min-aggregate.output';
import { AccountSessionMaxAggregate } from './account-session-max-aggregate.output';

@ObjectType()
export class AccountSessionGroupBy {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Date, {nullable:false})
    createdAt!: Date | string;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date | string;

    @Field(() => Int, {nullable:false})
    accountId!: number;

    @HideField()
    token!: string;

    @Field(() => String, {nullable:false})
    ipAddr!: string;

    @Field(() => String, {nullable:true})
    userAgent?: string;

    @Field(() => Date, {nullable:false})
    expiresAt!: Date | string;

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
