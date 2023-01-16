import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { OneTimeCodeWhereUniqueInput } from './one-time-code-where-unique.input';
import { Type } from 'class-transformer';

@ArgsType()
export class FindUniqueOneTimeCodeOrThrowArgs {

    @Field(() => OneTimeCodeWhereUniqueInput, {nullable:false})
    @Type(() => OneTimeCodeWhereUniqueInput)
    where!: OneTimeCodeWhereUniqueInput;
}
