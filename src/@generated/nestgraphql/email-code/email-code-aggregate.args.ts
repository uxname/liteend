import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { EmailCodeWhereInput } from './email-code-where.input';
import { Type } from 'class-transformer';
import { EmailCodeOrderByWithRelationInput } from './email-code-order-by-with-relation.input';
import { EmailCodeWhereUniqueInput } from './email-code-where-unique.input';
import { Int } from '@nestjs/graphql';
import { EmailCodeCountAggregateInput } from './email-code-count-aggregate.input';
import { EmailCodeAvgAggregateInput } from './email-code-avg-aggregate.input';
import { EmailCodeSumAggregateInput } from './email-code-sum-aggregate.input';
import { EmailCodeMinAggregateInput } from './email-code-min-aggregate.input';
import { EmailCodeMaxAggregateInput } from './email-code-max-aggregate.input';

@ArgsType()
export class EmailCodeAggregateArgs {

    @Field(() => EmailCodeWhereInput, {nullable:true})
    @Type(() => EmailCodeWhereInput)
    where?: EmailCodeWhereInput;

    @Field(() => [EmailCodeOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<EmailCodeOrderByWithRelationInput>;

    @Field(() => EmailCodeWhereUniqueInput, {nullable:true})
    cursor?: EmailCodeWhereUniqueInput;

    @Field(() => Int, {nullable:true})
    take?: number;

    @Field(() => Int, {nullable:true})
    skip?: number;

    @Field(() => EmailCodeCountAggregateInput, {nullable:true})
    _count?: EmailCodeCountAggregateInput;

    @Field(() => EmailCodeAvgAggregateInput, {nullable:true})
    _avg?: EmailCodeAvgAggregateInput;

    @Field(() => EmailCodeSumAggregateInput, {nullable:true})
    _sum?: EmailCodeSumAggregateInput;

    @Field(() => EmailCodeMinAggregateInput, {nullable:true})
    _min?: EmailCodeMinAggregateInput;

    @Field(() => EmailCodeMaxAggregateInput, {nullable:true})
    _max?: EmailCodeMaxAggregateInput;
}
