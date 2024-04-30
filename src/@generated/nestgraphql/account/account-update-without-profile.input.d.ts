import { AccountSessionUpdateManyWithoutAccountNestedInput } from '../account-session/account-session-update-many-without-account-nested.input';
export declare class AccountUpdateWithoutProfileInput {
    createdAt?: Date | string;
    updatedAt?: Date | string;
    email?: string;
    passwordHash?: string;
    sessions?: AccountSessionUpdateManyWithoutAccountNestedInput;
}
