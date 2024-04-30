import { ProfileRole } from '../prisma/profile-role.enum';
import { AccountStatus } from '../prisma/account-status.enum';
export declare class ProfileCreateWithoutAccountsInput {
    createdAt?: Date | string;
    updatedAt?: Date | string;
    roles?: Array<keyof typeof ProfileRole>;
    status: keyof typeof AccountStatus;
    avatarUrl?: string;
    name?: string;
    bio?: string;
    totpEnabled?: boolean;
    totpSecret?: string;
}
