import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountSessionScalarWhereInput } from './account-session-scalar-where.input';
import { Type } from 'class-transformer';
import { AccountSessionUpdateManyMutationInput } from './account-session-update-many-mutation.input';

@InputType()
export class AccountSessionUpdateManyWithWhereWithoutAccountInput {

    @Field(() => AccountSessionScalarWhereInput, {nullable:false})
    @Type(() => AccountSessionScalarWhereInput)
    where!: AccountSessionScalarWhereInput;

    @Field(() => AccountSessionUpdateManyMutationInput, {nullable:false})
    @Type(() => AccountSessionUpdateManyMutationInput)
    data!: AccountSessionUpdateManyMutationInput;
}
