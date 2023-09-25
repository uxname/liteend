import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountScalarWhereInput } from './account-scalar-where.input';
import { Type } from 'class-transformer';
import { AccountUpdateManyMutationInput } from './account-update-many-mutation.input';

@InputType()
export class AccountUpdateManyWithWhereWithoutProfileInput {

    @Field(() => AccountScalarWhereInput, {nullable:false})
    @Type(() => AccountScalarWhereInput)
    where!: AccountScalarWhereInput;

    @Field(() => AccountUpdateManyMutationInput, {nullable:false})
    @Type(() => AccountUpdateManyMutationInput)
    data!: AccountUpdateManyMutationInput;
}
