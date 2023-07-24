import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { UploadWhereInput } from './upload-where.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { StringFilter } from '../prisma/string-filter.input';
import { IntFilter } from '../prisma/int-filter.input';

@InputType()
export class UploadWhereUniqueInput {

    @Field(() => Int, {nullable:true})
    id?: number;

    @Field(() => String, {nullable:true})
    filepath?: string;

    @Field(() => [UploadWhereInput], {nullable:true})
    AND?: Array<UploadWhereInput>;

    @Field(() => [UploadWhereInput], {nullable:true})
    OR?: Array<UploadWhereInput>;

    @Field(() => [UploadWhereInput], {nullable:true})
    NOT?: Array<UploadWhereInput>;

    @Field(() => DateTimeFilter, {nullable:true})
    createdAt?: DateTimeFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    updatedAt?: DateTimeFilter;

    @Field(() => StringFilter, {nullable:true})
    originalFilename?: StringFilter;

    @Field(() => StringFilter, {nullable:true})
    extension?: StringFilter;

    @Field(() => IntFilter, {nullable:true})
    size?: IntFilter;

    @Field(() => StringFilter, {nullable:true})
    mimetype?: StringFilter;

    @Field(() => StringFilter, {nullable:true})
    uploaderIp?: StringFilter;
}
