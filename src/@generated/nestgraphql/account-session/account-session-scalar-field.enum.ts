import { registerEnumType } from '@nestjs/graphql';

export enum AccountSessionScalarFieldEnum {
    id = "id",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    accountId = "accountId",
    token = "token",
    ipAddr = "ipAddr",
    userAgent = "userAgent",
    expiresAt = "expiresAt"
}


registerEnumType(AccountSessionScalarFieldEnum, { name: 'AccountSessionScalarFieldEnum', description: undefined })
