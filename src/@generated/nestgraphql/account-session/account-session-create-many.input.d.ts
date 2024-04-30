export declare class AccountSessionCreateManyInput {
    id?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accountId: number;
    token: string;
    ipAddr: string;
    userAgent?: string;
    expiresAt: Date | string;
}
