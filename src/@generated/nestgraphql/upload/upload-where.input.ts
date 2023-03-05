import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { IntFilter } from '../prisma/int-filter.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { StringFilter } from '../prisma/string-filter.input';

@InputType()
export class UploadWhereInput {

    @Field(() => [UploadWhereInput], {nullable:true})
    AND?: Array<UploadWhereInput>;

    @Field(() => [UploadWhereInput], {nullable:true})
    OR?: Array<UploadWhereInput>;

    @Field(() => [UploadWhereInput], {nullable:true})
    NOT?: Array<UploadWhereInput>;

    @Field(() => IntFilter, {nullable:true})
    id?: IntFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    createdAt?: DateTimeFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    updatedAt?: DateTimeFilter;

    @Field(() => StringFilter, {nullable:true})
    filepath?: StringFilter;

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
