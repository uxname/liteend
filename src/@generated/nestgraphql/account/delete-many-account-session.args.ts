import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { AccountSessionWhereInput } from '../account-session/account-session-where.input';
import { Type } from 'class-transformer';

@ArgsType()
export class DeleteManyAccountSessionArgs {

    @Field(() => AccountSessionWhereInput, {nullable:true})
    @Type(() => AccountSessionWhereInput)
    where?: AccountSessionWhereInput;
}
