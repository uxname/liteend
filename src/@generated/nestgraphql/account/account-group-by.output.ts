import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { HideField } from '@nestjs/graphql';
import { AccountRole } from '../prisma/account-role.enum';
import { AccountStatus } from '../prisma/account-status.enum';
import { AccountCountAggregate } from './account-count-aggregate.output';
import { AccountAvgAggregate } from './account-avg-aggregate.output';
import { AccountSumAggregate } from './account-sum-aggregate.output';
import { AccountMinAggregate } from './account-min-aggregate.output';
import { AccountMaxAggregate } from './account-max-aggregate.output';

@ObjectType()
export class AccountGroupBy {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Date, {nullable:false})
    createdAt!: Date | string;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date | string;

    @Field(() => String, {nullable:false})
    email!: string;

    @HideField()
    passwordHash!: string;

    @Field(() => [AccountRole], {nullable:true})
    roles?: Array<keyof typeof AccountRole>;

    @Field(() => AccountStatus, {nullable:false})
    status!: keyof typeof AccountStatus;

    @Field(() => String, {nullable:true})
    avatarUrl?: string;

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
