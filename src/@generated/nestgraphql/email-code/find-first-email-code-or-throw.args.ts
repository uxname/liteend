import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { EmailCodeWhereInput } from './email-code-where.input';
import { Type } from 'class-transformer';
import { EmailCodeOrderByWithRelationInput } from './email-code-order-by-with-relation.input';
import { EmailCodeWhereUniqueInput } from './email-code-where-unique.input';
import { Int } from '@nestjs/graphql';
import { EmailCodeScalarFieldEnum } from './email-code-scalar-field.enum';

@ArgsType()
export class FindFirstEmailCodeOrThrowArgs {

    @Field(() => EmailCodeWhereInput, {nullable:true})
    @Type(() => EmailCodeWhereInput)
    where?: EmailCodeWhereInput;

    @Field(() => [EmailCodeOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<EmailCodeOrderByWithRelationInput>;

    @Field(() => EmailCodeWhereUniqueInput, {nullable:true})
    cursor?: EmailCodeWhereUniqueInput;

    @Field(() => Int, {nullable:true})
    take?: number;

    @Field(() => Int, {nullable:true})
    skip?: number;

    @Field(() => [EmailCodeScalarFieldEnum], {nullable:true})
    distinct?: Array<keyof typeof EmailCodeScalarFieldEnum>;
}
