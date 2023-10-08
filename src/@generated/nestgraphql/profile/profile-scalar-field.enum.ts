import { registerEnumType } from '@nestjs/graphql';

export enum ProfileScalarFieldEnum {
    id = "id",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    roles = "roles",
    status = "status",
    avatarUrl = "avatarUrl",
    name = "name",
    bio = "bio",
    totpEnabled = "totpEnabled",
    totpSecret = "totpSecret"
}


registerEnumType(ProfileScalarFieldEnum, { name: 'ProfileScalarFieldEnum', description: undefined })
