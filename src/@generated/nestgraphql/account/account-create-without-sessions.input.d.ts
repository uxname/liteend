import { ProfileCreateNestedOneWithoutAccountsInput } from '../profile/profile-create-nested-one-without-accounts.input';
export declare class AccountCreateWithoutSessionsInput {
    createdAt?: Date | string;
    updatedAt?: Date | string;
    email: string;
    passwordHash: string;
    profile?: ProfileCreateNestedOneWithoutAccountsInput;
}
