import { AccountSessionUncheckedUpdateManyWithoutAccountNestedInput } from '../account-session/account-session-unchecked-update-many-without-account-nested.input';
export declare class AccountUncheckedUpdateInput {
    id?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    email?: string;
    passwordHash?: string;
    profileId?: number;
    sessions?: AccountSessionUncheckedUpdateManyWithoutAccountNestedInput;
}
