import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { UploadWhereInput } from './upload-where.input';
import { Type } from 'class-transformer';
import { UploadOrderByWithRelationInput } from './upload-order-by-with-relation.input';
import { UploadWhereUniqueInput } from './upload-where-unique.input';
import { Int } from '@nestjs/graphql';
import { UploadCountAggregateInput } from './upload-count-aggregate.input';
import { UploadAvgAggregateInput } from './upload-avg-aggregate.input';
import { UploadSumAggregateInput } from './upload-sum-aggregate.input';
import { UploadMinAggregateInput } from './upload-min-aggregate.input';
import { UploadMaxAggregateInput } from './upload-max-aggregate.input';

@ArgsType()
export class UploadAggregateArgs {

    @Field(() => UploadWhereInput, {nullable:true})
    @Type(() => UploadWhereInput)
    where?: UploadWhereInput;

    @Field(() => [UploadOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<UploadOrderByWithRelationInput>;

    @Field(() => UploadWhereUniqueInput, {nullable:true})
    cursor?: UploadWhereUniqueInput;

    @Field(() => Int, {nullable:true})
    take?: number;

    @Field(() => Int, {nullable:true})
    skip?: number;

    @Field(() => UploadCountAggregateInput, {nullable:true})
    _count?: UploadCountAggregateInput;

    @Field(() => UploadAvgAggregateInput, {nullable:true})
    _avg?: UploadAvgAggregateInput;

    @Field(() => UploadSumAggregateInput, {nullable:true})
    _sum?: UploadSumAggregateInput;

    @Field(() => UploadMinAggregateInput, {nullable:true})
    _min?: UploadMinAggregateInput;

    @Field(() => UploadMaxAggregateInput, {nullable:true})
    _max?: UploadMaxAggregateInput;
}
