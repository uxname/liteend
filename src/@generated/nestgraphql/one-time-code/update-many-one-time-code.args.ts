import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { OneTimeCodeUpdateManyMutationInput } from './one-time-code-update-many-mutation.input';
import { Type } from 'class-transformer';
import { OneTimeCodeWhereInput } from './one-time-code-where.input';

@ArgsType()
export class UpdateManyOneTimeCodeArgs {

    @Field(() => OneTimeCodeUpdateManyMutationInput, {nullable:false})
    @Type(() => OneTimeCodeUpdateManyMutationInput)
    data!: OneTimeCodeUpdateManyMutationInput;

    @Field(() => OneTimeCodeWhereInput, {nullable:true})
    @Type(() => OneTimeCodeWhereInput)
    where?: OneTimeCodeWhereInput;
}
