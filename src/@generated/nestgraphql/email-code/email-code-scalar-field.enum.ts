import { registerEnumType } from '@nestjs/graphql';

export enum EmailCodeScalarFieldEnum {
    id = "id",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    email = "email",
    code = "code",
    expiresAt = "expiresAt"
}


registerEnumType(EmailCodeScalarFieldEnum, { name: 'EmailCodeScalarFieldEnum', description: undefined })
