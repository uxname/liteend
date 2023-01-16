import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { EmailCodeWhereInput } from './email-code-where.input';
import { Type } from 'class-transformer';

@ArgsType()
export class DeleteManyEmailCodeArgs {

    @Field(() => EmailCodeWhereInput, {nullable:true})
    @Type(() => EmailCodeWhereInput)
    where?: EmailCodeWhereInput;
}
