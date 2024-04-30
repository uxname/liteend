import { AccountSessionCreateNestedManyWithoutAccountInput } from '../account-session/account-session-create-nested-many-without-account.input';
import { ProfileCreateNestedOneWithoutAccountsInput } from '../profile/profile-create-nested-one-without-accounts.input';
export declare class AccountCreateInput {
    createdAt?: Date | string;
    updatedAt?: Date | string;
    email: string;
    passwordHash: string;
    sessions?: AccountSessionCreateNestedManyWithoutAccountInput;
    profile?: ProfileCreateNestedOneWithoutAccountsInput;
}
