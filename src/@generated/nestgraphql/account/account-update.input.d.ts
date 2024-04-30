import { AccountSessionUpdateManyWithoutAccountNestedInput } from '../account-session/account-session-update-many-without-account-nested.input';
import { ProfileUpdateOneWithoutAccountsNestedInput } from '../profile/profile-update-one-without-accounts-nested.input';
export declare class AccountUpdateInput {
    createdAt?: Date | string;
    updatedAt?: Date | string;
    email?: string;
    passwordHash?: string;
    sessions?: AccountSessionUpdateManyWithoutAccountNestedInput;
    profile?: ProfileUpdateOneWithoutAccountsNestedInput;
}
