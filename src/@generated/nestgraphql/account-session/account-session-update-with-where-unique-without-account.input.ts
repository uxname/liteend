import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountSessionWhereUniqueInput } from './account-session-where-unique.input';
import { Type } from 'class-transformer';
import { AccountSessionUpdateWithoutAccountInput } from './account-session-update-without-account.input';

@InputType()
export class AccountSessionUpdateWithWhereUniqueWithoutAccountInput {

    @Field(() => AccountSessionWhereUniqueInput, {nullable:false})
    @Type(() => AccountSessionWhereUniqueInput)
    where!: AccountSessionWhereUniqueInput;

    @Field(() => AccountSessionUpdateWithoutAccountInput, {nullable:false})
    @Type(() => AccountSessionUpdateWithoutAccountInput)
    data!: AccountSessionUpdateWithoutAccountInput;
}
