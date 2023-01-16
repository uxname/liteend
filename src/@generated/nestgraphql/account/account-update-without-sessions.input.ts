import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { DateTimeFieldUpdateOperationsInput } from '../prisma/date-time-field-update-operations.input';
import { StringFieldUpdateOperationsInput } from '../prisma/string-field-update-operations.input';
import { AccountUpdaterolesInput } from './account-updateroles.input';
import { EnumAccountStatusFieldUpdateOperationsInput } from '../prisma/enum-account-status-field-update-operations.input';

@InputType()
export class AccountUpdateWithoutSessionsInput {

    @Field(() => DateTimeFieldUpdateOperationsInput, {nullable:true})
    createdAt?: DateTimeFieldUpdateOperationsInput;

    @Field(() => DateTimeFieldUpdateOperationsInput, {nullable:true})
    updatedAt?: DateTimeFieldUpdateOperationsInput;

    @Field(() => StringFieldUpdateOperationsInput, {nullable:true})
    email?: StringFieldUpdateOperationsInput;

    @Field(() => StringFieldUpdateOperationsInput, {nullable:true})
    passwordHash?: StringFieldUpdateOperationsInput;

    @Field(() => AccountUpdaterolesInput, {nullable:true})
    roles?: AccountUpdaterolesInput;

    @Field(() => EnumAccountStatusFieldUpdateOperationsInput, {nullable:true})
    status?: EnumAccountStatusFieldUpdateOperationsInput;
}
