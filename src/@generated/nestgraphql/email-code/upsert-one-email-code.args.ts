import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { EmailCodeWhereUniqueInput } from './email-code-where-unique.input';
import { Type } from 'class-transformer';
import { EmailCodeCreateInput } from './email-code-create.input';
import { EmailCodeUpdateInput } from './email-code-update.input';

@ArgsType()
export class UpsertOneEmailCodeArgs {

    @Field(() => EmailCodeWhereUniqueInput, {nullable:false})
    @Type(() => EmailCodeWhereUniqueInput)
    where!: EmailCodeWhereUniqueInput;

    @Field(() => EmailCodeCreateInput, {nullable:false})
    @Type(() => EmailCodeCreateInput)
    create!: EmailCodeCreateInput;

    @Field(() => EmailCodeUpdateInput, {nullable:false})
    @Type(() => EmailCodeUpdateInput)
    update!: EmailCodeUpdateInput;
}
