import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { EmailCodeUpdateManyMutationInput } from './email-code-update-many-mutation.input';
import { Type } from 'class-transformer';
import { EmailCodeWhereInput } from './email-code-where.input';

@ArgsType()
export class UpdateManyEmailCodeArgs {

    @Field(() => EmailCodeUpdateManyMutationInput, {nullable:false})
    @Type(() => EmailCodeUpdateManyMutationInput)
    data!: EmailCodeUpdateManyMutationInput;

    @Field(() => EmailCodeWhereInput, {nullable:true})
    @Type(() => EmailCodeWhereInput)
    where?: EmailCodeWhereInput;
}
