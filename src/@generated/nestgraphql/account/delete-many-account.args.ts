import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { AccountWhereInput } from './account-where.input';
import { Type } from 'class-transformer';

@ArgsType()
export class DeleteManyAccountArgs {

    @Field(() => AccountWhereInput, {nullable:true})
    @Type(() => AccountWhereInput)
    where?: AccountWhereInput;
}
