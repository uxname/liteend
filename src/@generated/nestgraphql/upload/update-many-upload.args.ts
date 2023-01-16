import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { UploadUpdateManyMutationInput } from './upload-update-many-mutation.input';
import { Type } from 'class-transformer';
import { UploadWhereInput } from './upload-where.input';

@ArgsType()
export class UpdateManyUploadArgs {

    @Field(() => UploadUpdateManyMutationInput, {nullable:false})
    @Type(() => UploadUpdateManyMutationInput)
    data!: UploadUpdateManyMutationInput;

    @Field(() => UploadWhereInput, {nullable:true})
    @Type(() => UploadWhereInput)
    where?: UploadWhereInput;
}
