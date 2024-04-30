import { AccountSession } from '../account-session/account-session.model';
import { Profile } from '../profile/profile.model';
import { AccountCount } from './account-count.output';
export declare class Account {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    passwordHash: string;
    profileId: number | null;
    sessions?: Array<AccountSession>;
    profile?: Profile | null;
    _count?: AccountCount;
}
