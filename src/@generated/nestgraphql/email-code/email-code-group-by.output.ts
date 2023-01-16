import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { EmailCodeCountAggregate } from './email-code-count-aggregate.output';
import { EmailCodeAvgAggregate } from './email-code-avg-aggregate.output';
import { EmailCodeSumAggregate } from './email-code-sum-aggregate.output';
import { EmailCodeMinAggregate } from './email-code-min-aggregate.output';
import { EmailCodeMaxAggregate } from './email-code-max-aggregate.output';

@ObjectType()
export class EmailCodeGroupBy {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Date, {nullable:false})
    createdAt!: Date | string;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date | string;

    @Field(() => String, {nullable:false})
    email!: string;

    @Field(() => String, {nullable:false})
    code!: string;

    @Field(() => Date, {nullable:false})
    expiresAt!: Date | string;

    @Field(() => EmailCodeCountAggregate, {nullable:true})
    _count?: EmailCodeCountAggregate;

    @Field(() => EmailCodeAvgAggregate, {nullable:true})
    _avg?: EmailCodeAvgAggregate;

    @Field(() => EmailCodeSumAggregate, {nullable:true})
    _sum?: EmailCodeSumAggregate;

    @Field(() => EmailCodeMinAggregate, {nullable:true})
    _min?: EmailCodeMinAggregate;

    @Field(() => EmailCodeMaxAggregate, {nullable:true})
    _max?: EmailCodeMaxAggregate;
}
