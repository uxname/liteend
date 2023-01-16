import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { OneTimeCodeWhereInput } from './one-time-code-where.input';
import { Type } from 'class-transformer';
import { OneTimeCodeOrderByWithRelationInput } from './one-time-code-order-by-with-relation.input';
import { OneTimeCodeWhereUniqueInput } from './one-time-code-where-unique.input';
import { Int } from '@nestjs/graphql';
import { OneTimeCodeScalarFieldEnum } from './one-time-code-scalar-field.enum';

@ArgsType()
export class FindManyOneTimeCodeArgs {

    @Field(() => OneTimeCodeWhereInput, {nullable:true})
    @Type(() => OneTimeCodeWhereInput)
    where?: OneTimeCodeWhereInput;

    @Field(() => [OneTimeCodeOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<OneTimeCodeOrderByWithRelationInput>;

    @Field(() => OneTimeCodeWhereUniqueInput, {nullable:true})
    cursor?: OneTimeCodeWhereUniqueInput;

    @Field(() => Int, {nullable:true})
    take?: number;

    @Field(() => Int, {nullable:true})
    skip?: number;

    @Field(() => [OneTimeCodeScalarFieldEnum], {nullable:true})
    distinct?: Array<keyof typeof OneTimeCodeScalarFieldEnum>;
}
