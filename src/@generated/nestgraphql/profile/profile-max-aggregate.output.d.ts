import { AccountStatus } from '../prisma/account-status.enum';
export declare class ProfileMaxAggregate {
    id?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    status?: keyof typeof AccountStatus;
    avatarUrl?: string;
    name?: string;
    bio?: string;
    totpEnabled?: boolean;
    totpSecret?: string;
}
