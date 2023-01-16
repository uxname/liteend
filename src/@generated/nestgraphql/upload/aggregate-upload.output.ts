import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { UploadCountAggregate } from './upload-count-aggregate.output';
import { UploadAvgAggregate } from './upload-avg-aggregate.output';
import { UploadSumAggregate } from './upload-sum-aggregate.output';
import { UploadMinAggregate } from './upload-min-aggregate.output';
import { UploadMaxAggregate } from './upload-max-aggregate.output';

@ObjectType()
export class AggregateUpload {

    @Field(() => UploadCountAggregate, {nullable:true})
    _count?: UploadCountAggregate;

    @Field(() => UploadAvgAggregate, {nullable:true})
    _avg?: UploadAvgAggregate;

    @Field(() => UploadSumAggregate, {nullable:true})
    _sum?: UploadSumAggregate;

    @Field(() => UploadMinAggregate, {nullable:true})
    _min?: UploadMinAggregate;

    @Field(() => UploadMaxAggregate, {nullable:true})
    _max?: UploadMaxAggregate;
}
