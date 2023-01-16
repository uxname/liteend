import { registerEnumType } from '@nestjs/graphql';

export enum UploadScalarFieldEnum {
    id = "id",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    filename = "filename",
    originalFilename = "originalFilename",
    extension = "extension",
    size = "size",
    mimetype = "mimetype",
    uploaderIp = "uploaderIp"
}


registerEnumType(UploadScalarFieldEnum, { name: 'UploadScalarFieldEnum', description: undefined })
