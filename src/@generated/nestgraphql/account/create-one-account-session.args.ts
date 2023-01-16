import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { AccountSessionCreateInput } from '../account-session/account-session-create.input';
import { Type } from 'class-transformer';

@ArgsType()
export class CreateOneAccountSessionArgs {

    @Field(() => AccountSessionCreateInput, {nullable:false})
    @Type(() => AccountSessionCreateInput)
    data!: AccountSessionCreateInput;
}
