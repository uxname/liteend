import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountStatus } from './account-status.enum';

@InputType()
export class EnumAccountStatusFieldUpdateOperationsInput {

    @Field(() => AccountStatus, {nullable:true})
    set?: keyof typeof AccountStatus;
}
