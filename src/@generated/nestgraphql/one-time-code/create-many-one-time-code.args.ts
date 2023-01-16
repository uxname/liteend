import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { OneTimeCodeCreateManyInput } from './one-time-code-create-many.input';
import { Type } from 'class-transformer';

@ArgsType()
export class CreateManyOneTimeCodeArgs {

    @Field(() => [OneTimeCodeCreateManyInput], {nullable:false})
    @Type(() => OneTimeCodeCreateManyInput)
    data!: Array<OneTimeCodeCreateManyInput>;

    @Field(() => Boolean, {nullable:true})
    skipDuplicates?: boolean;
}
