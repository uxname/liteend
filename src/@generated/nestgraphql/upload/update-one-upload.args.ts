import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { UploadUpdateInput } from './upload-update.input';
import { Type } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { UploadWhereUniqueInput } from './upload-where-unique.input';

@ArgsType()
export class UpdateOneUploadArgs {

    @Field(() => UploadUpdateInput, {nullable:false})
    @Type(() => UploadUpdateInput)
    data!: UploadUpdateInput;

    @Field(() => UploadWhereUniqueInput, {nullable:false})
    @Type(() => UploadWhereUniqueInput)
    where!: Prisma.AtLeast<UploadWhereUniqueInput, 'id' | 'filepath'>;
}
