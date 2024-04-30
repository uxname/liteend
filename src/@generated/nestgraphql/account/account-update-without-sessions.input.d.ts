import { ProfileUpdateOneWithoutAccountsNestedInput } from '../profile/profile-update-one-without-accounts-nested.input';
export declare class AccountUpdateWithoutSessionsInput {
    createdAt?: Date | string;
    updatedAt?: Date | string;
    email?: string;
    passwordHash?: string;
    profile?: ProfileUpdateOneWithoutAccountsNestedInput;
}
