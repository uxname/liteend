import { AccountCreateNestedOneWithoutSessionsInput } from '../account/account-create-nested-one-without-sessions.input';
export declare class AccountSessionCreateInput {
    createdAt?: Date | string;
    updatedAt?: Date | string;
    token: string;
    ipAddr: string;
    userAgent?: string;
    expiresAt: Date | string;
    account: AccountCreateNestedOneWithoutSessionsInput;
}
