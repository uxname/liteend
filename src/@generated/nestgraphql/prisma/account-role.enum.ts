import { registerEnumType } from '@nestjs/graphql';

export enum AccountRole {
    ADMIN = "ADMIN",
    USER = "USER"
}


registerEnumType(AccountRole, { name: 'AccountRole', description: undefined })
