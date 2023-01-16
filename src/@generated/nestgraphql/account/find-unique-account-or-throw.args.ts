import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { AccountWhereUniqueInput } from './account-where-unique.input';
import { Type } from 'class-transformer';

@ArgsType()
export class FindUniqueAccountOrThrowArgs {

    @Field(() => AccountWhereUniqueInput, {nullable:false})
    @Type(() => AccountWhereUniqueInput)
    where!: AccountWhereUniqueInput;
}
