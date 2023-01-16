import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { UploadCreateInput } from './upload-create.input';
import { Type } from 'class-transformer';

@ArgsType()
export class CreateOneUploadArgs {

    @Field(() => UploadCreateInput, {nullable:false})
    @Type(() => UploadCreateInput)
    data!: UploadCreateInput;
}
