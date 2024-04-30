export declare class AccountSessionUncheckedCreateInput {
    id?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accountId: number;
    token: string;
    ipAddr: string;
    userAgent?: string;
    expiresAt: Date | string;
}
