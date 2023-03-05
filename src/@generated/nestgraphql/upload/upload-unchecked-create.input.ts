import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';

@InputType()
export class UploadUncheckedCreateInput {

    @Field(() => Int, {nullable:true})
    id?: number;

    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;

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
