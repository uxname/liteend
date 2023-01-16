import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { AccountCreaterolesInput } from './account-createroles.input';
import { AccountStatus } from '../prisma/account-status.enum';

@InputType()
export class AccountCreateManyInput {

    @Field(() => Int, {nullable:true})
    id?: number;

    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;

    @Field(() => String, {nullable:false})
    email!: string;

    @Field(() => String, {nullable:false})
    passwordHash!: string;

    @Field(() => AccountCreaterolesInput, {nullable:true})
    roles?: AccountCreaterolesInput;

    @Field(() => AccountStatus, {nullable:false})
    status!: keyof typeof AccountStatus;
}
