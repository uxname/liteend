import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { EmailCodeWhereUniqueInput } from './email-code-where-unique.input';
import { Type } from 'class-transformer';

@ArgsType()
export class FindUniqueEmailCodeOrThrowArgs {

    @Field(() => EmailCodeWhereUniqueInput, {nullable:false})
    @Type(() => EmailCodeWhereUniqueInput)
    where!: EmailCodeWhereUniqueInput;
}
