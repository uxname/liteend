import { ProfileRole } from '../prisma/profile-role.enum';
import { AccountStatus } from '../prisma/account-status.enum';
import { Account } from '../account/account.model';
import { ProfileCount } from './profile-count.output';
export declare class Profile {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    roles: Array<keyof typeof ProfileRole>;
    status: keyof typeof AccountStatus;
    avatarUrl: string | null;
    name: string | null;
    bio: string | null;
    totpEnabled: boolean;
    totpSecret: string | null;
    accounts?: Array<Account>;
    _count?: ProfileCount;
}
