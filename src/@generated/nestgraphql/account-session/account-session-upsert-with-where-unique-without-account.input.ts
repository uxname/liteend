import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountSessionWhereUniqueInput } from './account-session-where-unique.input';
import { Type } from 'class-transformer';
import { AccountSessionUpdateWithoutAccountInput } from './account-session-update-without-account.input';
import { AccountSessionCreateWithoutAccountInput } from './account-session-create-without-account.input';

@InputType()
export class AccountSessionUpsertWithWhereUniqueWithoutAccountInput {

    @Field(() => AccountSessionWhereUniqueInput, {nullable:false})
    @Type(() => AccountSessionWhereUniqueInput)
    where!: AccountSessionWhereUniqueInput;

    @Field(() => AccountSessionUpdateWithoutAccountInput, {nullable:false})
    @Type(() => AccountSessionUpdateWithoutAccountInput)
    update!: AccountSessionUpdateWithoutAccountInput;

    @Field(() => AccountSessionCreateWithoutAccountInput, {nullable:false})
    @Type(() => AccountSessionCreateWithoutAccountInput)
    create!: AccountSessionCreateWithoutAccountInput;
}
