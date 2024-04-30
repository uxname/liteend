import { AccountCreateWithoutSessionsInput } from './account-create-without-sessions.input';
import { AccountCreateOrConnectWithoutSessionsInput } from './account-create-or-connect-without-sessions.input';
import { AccountUpsertWithoutSessionsInput } from './account-upsert-without-sessions.input';
import { Prisma } from '@prisma/client';
import { AccountWhereUniqueInput } from './account-where-unique.input';
import { AccountUpdateToOneWithWhereWithoutSessionsInput } from './account-update-to-one-with-where-without-sessions.input';
export declare class AccountUpdateOneRequiredWithoutSessionsNestedInput {
    create?: AccountCreateWithoutSessionsInput;
    connectOrCreate?: AccountCreateOrConnectWithoutSessionsInput;
    upsert?: AccountUpsertWithoutSessionsInput;
    connect?: Prisma.AtLeast<AccountWhereUniqueInput, 'id' | 'email'>;
    update?: AccountUpdateToOneWithWhereWithoutSessionsInput;
}
