import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { SortOrder } from '../prisma/sort-order.enum';

@InputType()
export class UploadMaxOrderByAggregateInput {

    @Field(() => SortOrder, {nullable:true})
    id?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    createdAt?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    updatedAt?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    filepath?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    originalFilename?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    extension?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    size?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    mimetype?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    uploaderIp?: keyof typeof SortOrder;
}
