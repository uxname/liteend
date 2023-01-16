import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { OneTimeCodeCreateInput } from './one-time-code-create.input';
import { Type } from 'class-transformer';

@ArgsType()
export class CreateOneOneTimeCodeArgs {

    @Field(() => OneTimeCodeCreateInput, {nullable:false})
    @Type(() => OneTimeCodeCreateInput)
    data!: OneTimeCodeCreateInput;
}
