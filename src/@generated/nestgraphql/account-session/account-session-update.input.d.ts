import { AccountUpdateOneRequiredWithoutSessionsNestedInput } from '../account/account-update-one-required-without-sessions-nested.input';
export declare class AccountSessionUpdateInput {
    createdAt?: Date | string;
    updatedAt?: Date | string;
    token?: string;
    ipAddr?: string;
    userAgent?: string;
    expiresAt?: Date | string;
    account?: AccountUpdateOneRequiredWithoutSessionsNestedInput;
}
