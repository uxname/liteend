import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { UploadWhereUniqueInput } from './upload-where-unique.input';
import { Type } from 'class-transformer';

@ArgsType()
export class FindUniqueUploadOrThrowArgs {

    @Field(() => UploadWhereUniqueInput, {nullable:false})
    @Type(() => UploadWhereUniqueInput)
    where!: Prisma.AtLeast<UploadWhereUniqueInput, 'id' | 'filepath'>;
}
