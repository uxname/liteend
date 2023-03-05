import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { SortOrder } from '../prisma/sort-order.enum';
import { UploadCountOrderByAggregateInput } from './upload-count-order-by-aggregate.input';
import { UploadAvgOrderByAggregateInput } from './upload-avg-order-by-aggregate.input';
import { UploadMaxOrderByAggregateInput } from './upload-max-order-by-aggregate.input';
import { UploadMinOrderByAggregateInput } from './upload-min-order-by-aggregate.input';
import { UploadSumOrderByAggregateInput } from './upload-sum-order-by-aggregate.input';

@InputType()
export class UploadOrderByWithAggregationInput {

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

    @Field(() => UploadCountOrderByAggregateInput, {nullable:true})
    _count?: UploadCountOrderByAggregateInput;

    @Field(() => UploadAvgOrderByAggregateInput, {nullable:true})
    _avg?: UploadAvgOrderByAggregateInput;

    @Field(() => UploadMaxOrderByAggregateInput, {nullable:true})
    _max?: UploadMaxOrderByAggregateInput;

    @Field(() => UploadMinOrderByAggregateInput, {nullable:true})
    _min?: UploadMinOrderByAggregateInput;

    @Field(() => UploadSumOrderByAggregateInput, {nullable:true})
    _sum?: UploadSumOrderByAggregateInput;
}
