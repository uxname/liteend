import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { AccountSessionWhereUniqueInput } from '../account-session/account-session-where-unique.input';
import { Type } from 'class-transformer';

@ArgsType()
export class DeleteOneAccountSessionArgs {

    @Field(() => AccountSessionWhereUniqueInput, {nullable:false})
    @Type(() => AccountSessionWhereUniqueInput)
    where!: AccountSessionWhereUniqueInput;
}
