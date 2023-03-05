import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';

@ObjectType()
export class UploadMaxAggregate {

    @Field(() => Int, {nullable:true})
    id?: number;

    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;

    @Field(() => String, {nullable:true})
    filepath?: string;

    @Field(() => String, {nullable:true})
    originalFilename?: string;

    @Field(() => String, {nullable:true})
    extension?: string;

    @Field(() => Int, {nullable:true})
    size?: number;

    @Field(() => String, {nullable:true})
    mimetype?: string;

    @Field(() => String, {nullable:true})
    uploaderIp?: string;
}
