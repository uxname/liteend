import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { OneTimeCodeUpdateInput } from './one-time-code-update.input';
import { Type } from 'class-transformer';
import { OneTimeCodeWhereUniqueInput } from './one-time-code-where-unique.input';

@ArgsType()
export class UpdateOneOneTimeCodeArgs {

    @Field(() => OneTimeCodeUpdateInput, {nullable:false})
    @Type(() => OneTimeCodeUpdateInput)
    data!: OneTimeCodeUpdateInput;

    @Field(() => OneTimeCodeWhereUniqueInput, {nullable:false})
    @Type(() => OneTimeCodeWhereUniqueInput)
    where!: OneTimeCodeWhereUniqueInput;
}
