import { registerEnumType } from '@nestjs/graphql';

export enum OneTimeCodeScalarFieldEnum {
    id = "id",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    email = "email",
    code = "code",
    expiresAt = "expiresAt"
}


registerEnumType(OneTimeCodeScalarFieldEnum, { name: 'OneTimeCodeScalarFieldEnum', description: undefined })
