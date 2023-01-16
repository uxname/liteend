import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { AccountCreateManyInput } from './account-create-many.input';
import { Type } from 'class-transformer';

@ArgsType()
export class CreateManyAccountArgs {

    @Field(() => [AccountCreateManyInput], {nullable:false})
    @Type(() => AccountCreateManyInput)
    data!: Array<AccountCreateManyInput>;

    @Field(() => Boolean, {nullable:true})
    skipDuplicates?: boolean;
}
