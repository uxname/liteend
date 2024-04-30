"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadScalarFieldEnum = void 0;
const graphql_1 = require("@nestjs/graphql");
var UploadScalarFieldEnum;
(function (UploadScalarFieldEnum) {
    UploadScalarFieldEnum["id"] = "id";
    UploadScalarFieldEnum["createdAt"] = "createdAt";
    UploadScalarFieldEnum["updatedAt"] = "updatedAt";
    UploadScalarFieldEnum["filepath"] = "filepath";
    UploadScalarFieldEnum["originalFilename"] = "originalFilename";
    UploadScalarFieldEnum["extension"] = "extension";
    UploadScalarFieldEnum["size"] = "size";
    UploadScalarFieldEnum["mimetype"] = "mimetype";
    UploadScalarFieldEnum["uploaderIp"] = "uploaderIp";
})(UploadScalarFieldEnum = exports.UploadScalarFieldEnum || (exports.UploadScalarFieldEnum = {}));
(0, graphql_1.registerEnumType)(UploadScalarFieldEnum, { name: 'UploadScalarFieldEnum', description: undefined });
//# sourceMappingURL=upload-scalar-field.enum.js.map