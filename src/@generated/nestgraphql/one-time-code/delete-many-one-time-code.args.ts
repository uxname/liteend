import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { OneTimeCodeWhereInput } from './one-time-code-where.input';
import { Type } from 'class-transformer';

@ArgsType()
export class DeleteManyOneTimeCodeArgs {

    @Field(() => OneTimeCodeWhereInput, {nullable:true})
    @Type(() => OneTimeCodeWhereInput)
    where?: OneTimeCodeWhereInput;
}
