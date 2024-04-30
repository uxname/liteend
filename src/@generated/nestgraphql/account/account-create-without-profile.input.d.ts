import { AccountSessionCreateNestedManyWithoutAccountInput } from '../account-session/account-session-create-nested-many-without-account.input';
export declare class AccountCreateWithoutProfileInput {
    createdAt?: Date | string;
    updatedAt?: Date | string;
    email: string;
    passwordHash: string;
    sessions?: AccountSessionCreateNestedManyWithoutAccountInput;
}
