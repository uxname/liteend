import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { EmailCodeCreateManyInput } from './email-code-create-many.input';
import { Type } from 'class-transformer';

@ArgsType()
export class CreateManyEmailCodeArgs {

    @Field(() => [EmailCodeCreateManyInput], {nullable:false})
    @Type(() => EmailCodeCreateManyInput)
    data!: Array<EmailCodeCreateManyInput>;

    @Field(() => Boolean, {nullable:true})
    skipDuplicates?: boolean;
}
