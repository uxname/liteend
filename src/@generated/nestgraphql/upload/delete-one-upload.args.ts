import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { UploadWhereUniqueInput } from './upload-where-unique.input';
import { Type } from 'class-transformer';

@ArgsType()
export class DeleteOneUploadArgs {

    @Field(() => UploadWhereUniqueInput, {nullable:false})
    @Type(() => UploadWhereUniqueInput)
    where!: UploadWhereUniqueInput;
}
