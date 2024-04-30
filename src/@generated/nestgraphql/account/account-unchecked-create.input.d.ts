import { AccountSessionUncheckedCreateNestedManyWithoutAccountInput } from '../account-session/account-session-unchecked-create-nested-many-without-account.input';
export declare class AccountUncheckedCreateInput {
    id?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    email: string;
    passwordHash: string;
    profileId?: number;
    sessions?: AccountSessionUncheckedCreateNestedManyWithoutAccountInput;
}
