import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountSessionWhereUniqueInput } from './account-session-where-unique.input';
import { Type } from 'class-transformer';
import { AccountSessionCreateWithoutAccountInput } from './account-session-create-without-account.input';

@InputType()
export class AccountSessionCreateOrConnectWithoutAccountInput {

    @Field(() => AccountSessionWhereUniqueInput, {nullable:false})
    @Type(() => AccountSessionWhereUniqueInput)
    where!: AccountSessionWhereUniqueInput;

    @Field(() => AccountSessionCreateWithoutAccountInput, {nullable:false})
    @Type(() => AccountSessionCreateWithoutAccountInput)
    create!: AccountSessionCreateWithoutAccountInput;
}
