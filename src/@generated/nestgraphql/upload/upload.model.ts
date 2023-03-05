import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';

@ObjectType()
export class Upload {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

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
}
