import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { EmailCodeUpdateInput } from './email-code-update.input';
import { Type } from 'class-transformer';
import { EmailCodeWhereUniqueInput } from './email-code-where-unique.input';

@ArgsType()
export class UpdateOneEmailCodeArgs {

    @Field(() => EmailCodeUpdateInput, {nullable:false})
    @Type(() => EmailCodeUpdateInput)
    data!: EmailCodeUpdateInput;

    @Field(() => EmailCodeWhereUniqueInput, {nullable:false})
    @Type(() => EmailCodeWhereUniqueInput)
    where!: EmailCodeWhereUniqueInput;
}
