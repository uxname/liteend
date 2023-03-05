import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';

@InputType()
export class UploadMinAggregateInput {

    @Field(() => Boolean, {nullable:true})
    id?: true;

    @Field(() => Boolean, {nullable:true})
    createdAt?: true;

    @Field(() => Boolean, {nullable:true})
    updatedAt?: true;

    @Field(() => Boolean, {nullable:true})
    filepath?: true;

    @Field(() => Boolean, {nullable:true})
    originalFilename?: true;

    @Field(() => Boolean, {nullable:true})
    extension?: true;

    @Field(() => Boolean, {nullable:true})
    size?: true;

    @Field(() => Boolean, {nullable:true})
    mimetype?: true;

    @Field(() => Boolean, {nullable:true})
    uploaderIp?: true;
}
