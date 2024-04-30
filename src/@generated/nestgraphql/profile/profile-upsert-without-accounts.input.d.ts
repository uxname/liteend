import { ProfileUpdateWithoutAccountsInput } from './profile-update-without-accounts.input';
import { ProfileCreateWithoutAccountsInput } from './profile-create-without-accounts.input';
import { ProfileWhereInput } from './profile-where.input';
export declare class ProfileUpsertWithoutAccountsInput {
    update: ProfileUpdateWithoutAccountsInput;
    create: ProfileCreateWithoutAccountsInput;
    where?: ProfileWhereInput;
}
