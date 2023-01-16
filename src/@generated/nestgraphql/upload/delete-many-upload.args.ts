import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { UploadWhereInput } from './upload-where.input';
import { Type } from 'class-transformer';

@ArgsType()
export class DeleteManyUploadArgs {

    @Field(() => UploadWhereInput, {nullable:true})
    @Type(() => UploadWhereInput)
    where?: UploadWhereInput;
}
