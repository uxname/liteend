import { registerEnumType } from '@nestjs/graphql';

export enum AccountStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}


registerEnumType(AccountStatus, { name: 'AccountStatus', description: undefined })
