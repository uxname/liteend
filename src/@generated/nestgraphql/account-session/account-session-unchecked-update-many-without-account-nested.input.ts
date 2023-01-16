import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AccountSessionCreateWithoutAccountInput } from './account-session-create-without-account.input';
import { Type } from 'class-transformer';
import { AccountSessionCreateOrConnectWithoutAccountInput } from './account-session-create-or-connect-without-account.input';
import { AccountSessionUpsertWithWhereUniqueWithoutAccountInput } from './account-session-upsert-with-where-unique-without-account.input';
import { AccountSessionCreateManyAccountInputEnvelope } from './account-session-create-many-account-input-envelope.input';
import { AccountSessionWhereUniqueInput } from './account-session-where-unique.input';
import { AccountSessionUpdateWithWhereUniqueWithoutAccountInput } from './account-session-update-with-where-unique-without-account.input';
import { AccountSessionUpdateManyWithWhereWithoutAccountInput } from './account-session-update-many-with-where-without-account.input';
import { AccountSessionScalarWhereInput } from './account-session-scalar-where.input';

@InputType()
export class AccountSessionUncheckedUpdateManyWithoutAccountNestedInput {

    @Field(() => [AccountSessionCreateWithoutAccountInput], {nullable:true})
    @Type(() => AccountSessionCreateWithoutAccountInput)
    create?: Array<AccountSessionCreateWithoutAccountInput>;

    @Field(() => [AccountSessionCreateOrConnectWithoutAccountInput], {nullable:true})
    @Type(() => AccountSessionCreateOrConnectWithoutAccountInput)
    connectOrCreate?: Array<AccountSessionCreateOrConnectWithoutAccountInput>;

    @Field(() => [AccountSessionUpsertWithWhereUniqueWithoutAccountInput], {nullable:true})
    @Type(() => AccountSessionUpsertWithWhereUniqueWithoutAccountInput)
    upsert?: Array<AccountSessionUpsertWithWhereUniqueWithoutAccountInput>;

    @Field(() => AccountSessionCreateManyAccountInputEnvelope, {nullable:true})
    @Type(() => AccountSessionCreateManyAccountInputEnvelope)
    createMany?: AccountSessionCreateManyAccountInputEnvelope;

    @Field(() => [AccountSessionWhereUniqueInput], {nullable:true})
    @Type(() => AccountSessionWhereUniqueInput)
    set?: Array<AccountSessionWhereUniqueInput>;

    @Field(() => [AccountSessionWhereUniqueInput], {nullable:true})
    @Type(() => AccountSessionWhereUniqueInput)
    disconnect?: Array<AccountSessionWhereUniqueInput>;

    @Field(() => [AccountSessionWhereUniqueInput], {nullable:true})
    @Type(() => AccountSessionWhereUniqueInput)
    delete?: Array<AccountSessionWhereUniqueInput>;

    @Field(() => [AccountSessionWhereUniqueInput], {nullable:true})
    @Type(() => AccountSessionWhereUniqueInput)
    connect?: Array<AccountSessionWhereUniqueInput>;

    @Field(() => [AccountSessionUpdateWithWhereUniqueWithoutAccountInput], {nullable:true})
    @Type(() => AccountSessionUpdateWithWhereUniqueWithoutAccountInput)
    update?: Array<AccountSessionUpdateWithWhereUniqueWithoutAccountInput>;

    @Field(() => [AccountSessionUpdateManyWithWhereWithoutAccountInput], {nullable:true})
    @Type(() => AccountSessionUpdateManyWithWhereWithoutAccountInput)
    updateMany?: Array<AccountSessionUpdateManyWithWhereWithoutAccountInput>;

    @Field(() => [AccountSessionScalarWhereInput], {nullable:true})
    @Type(() => AccountSessionScalarWhereInput)
    deleteMany?: Array<AccountSessionScalarWhereInput>;
}
