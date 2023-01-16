import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountSessionCreateWithoutAccountInput } from './account-session-create-without-account.input';
import { Type } from 'class-transformer';
import { AccountSessionCreateOrConnectWithoutAccountInput } from './account-session-create-or-connect-without-account.input';
import { AccountSessionCreateManyAccountInputEnvelope } from './account-session-create-many-account-input-envelope.input';
import { AccountSessionWhereUniqueInput } from './account-session-where-unique.input';

@InputType()
export class AccountSessionUncheckedCreateNestedManyWithoutAccountInput {

    @Field(() => [AccountSessionCreateWithoutAccountInput], {nullable:true})
    @Type(() => AccountSessionCreateWithoutAccountInput)
    create?: Array<AccountSessionCreateWithoutAccountInput>;

    @Field(() => [AccountSessionCreateOrConnectWithoutAccountInput], {nullable:true})
    @Type(() => AccountSessionCreateOrConnectWithoutAccountInput)
    connectOrCreate?: Array<AccountSessionCreateOrConnectWithoutAccountInput>;

    @Field(() => AccountSessionCreateManyAccountInputEnvelope, {nullable:true})
    @Type(() => AccountSessionCreateManyAccountInputEnvelope)
    createMany?: AccountSessionCreateManyAccountInputEnvelope;

    @Field(() => [AccountSessionWhereUniqueInput], {nullable:true})
    @Type(() => AccountSessionWhereUniqueInput)
    connect?: Array<AccountSessionWhereUniqueInput>;
}
