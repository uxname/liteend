import { Account } from '../account/account.model';
export declare class AccountSession {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    accountId: number;
    token: string;
    ipAddr: string;
    userAgent: string | null;
    expiresAt: Date;
    account?: Account;
}
