import { registerEnumType } from '@nestjs/graphql';

export enum ProfileRole {
    ADMIN = "ADMIN",
    USER = "USER"
}


registerEnumType(ProfileRole, { name: 'ProfileRole', description: undefined })
