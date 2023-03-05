import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';

@ObjectType()
export class UploadCountAggregate {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Int, {nullable:false})
    createdAt!: number;

    @Field(() => Int, {nullable:false})
    updatedAt!: number;

    @Field(() => Int, {nullable:false})
    filepath!: number;

    @Field(() => Int, {nullable:false})
    originalFilename!: number;

    @Field(() => Int, {nullable:false})
    extension!: number;

    @Field(() => Int, {nullable:false})
    size!: number;

    @Field(() => Int, {nullable:false})
    mimetype!: number;

    @Field(() => Int, {nullable:false})
    uploaderIp!: number;

    @Field(() => Int, {nullable:false})
    _all!: number;
}
