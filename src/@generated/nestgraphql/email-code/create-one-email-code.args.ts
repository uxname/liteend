import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { EmailCodeCreateInput } from './email-code-create.input';
import { Type } from 'class-transformer';

@ArgsType()
export class CreateOneEmailCodeArgs {

    @Field(() => EmailCodeCreateInput, {nullable:false})
    @Type(() => EmailCodeCreateInput)
    data!: EmailCodeCreateInput;
}
