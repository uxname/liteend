import { AccountUpdateWithoutSessionsInput } from './account-update-without-sessions.input';
import { AccountCreateWithoutSessionsInput } from './account-create-without-sessions.input';
import { AccountWhereInput } from './account-where.input';
export declare class AccountUpsertWithoutSessionsInput {
    update: AccountUpdateWithoutSessionsInput;
    create: AccountCreateWithoutSessionsInput;
    where?: AccountWhereInput;
}
