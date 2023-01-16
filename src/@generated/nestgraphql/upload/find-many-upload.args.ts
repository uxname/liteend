import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { UploadWhereInput } from './upload-where.input';
import { Type } from 'class-transformer';
import { UploadOrderByWithRelationInput } from './upload-order-by-with-relation.input';
import { UploadWhereUniqueInput } from './upload-where-unique.input';
import { Int } from '@nestjs/graphql';
import { UploadScalarFieldEnum } from './upload-scalar-field.enum';

@ArgsType()
export class FindManyUploadArgs {

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

    @Field(() => [UploadScalarFieldEnum], {nullable:true})
    distinct?: Array<keyof typeof UploadScalarFieldEnum>;
}
