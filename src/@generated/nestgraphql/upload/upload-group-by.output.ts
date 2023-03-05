import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { UploadCountAggregate } from './upload-count-aggregate.output';
import { UploadAvgAggregate } from './upload-avg-aggregate.output';
import { UploadSumAggregate } from './upload-sum-aggregate.output';
import { UploadMinAggregate } from './upload-min-aggregate.output';
import { UploadMaxAggregate } from './upload-max-aggregate.output';

@ObjectType()
export class UploadGroupBy {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Date, {nullable:false})
    createdAt!: Date | string;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date | string;

    @Field(() => String, {nullable:false})
    filepath!: string;

    @Field(() => String, {nullable:false})
    originalFilename!: string;

    @Field(() => String, {nullable:false})
    extension!: string;

    @Field(() => Int, {nullable:false})
    size!: number;

    @Field(() => String, {nullable:false})
    mimetype!: string;

    @Field(() => String, {nullable:false})
    uploaderIp!: string;

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
