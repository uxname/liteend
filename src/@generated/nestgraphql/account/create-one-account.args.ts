import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { AccountCreateInput } from './account-create.input';
import { Type } from 'class-transformer';

@ArgsType()
export class CreateOneAccountArgs {

    @Field(() => AccountCreateInput, {nullable:false})
    @Type(() => AccountCreateInput)
    data!: AccountCreateInput;
}
