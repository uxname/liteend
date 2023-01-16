import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { AccountSessionUpdateManyMutationInput } from '../account-session/account-session-update-many-mutation.input';
import { Type } from 'class-transformer';
import { AccountSessionWhereInput } from '../account-session/account-session-where.input';

@ArgsType()
export class UpdateManyAccountSessionArgs {

    @Field(() => AccountSessionUpdateManyMutationInput, {nullable:false})
    @Type(() => AccountSessionUpdateManyMutationInput)
    data!: AccountSessionUpdateManyMutationInput;

    @Field(() => AccountSessionWhereInput, {nullable:true})
    @Type(() => AccountSessionWhereInput)
    where?: AccountSessionWhereInput;
}
