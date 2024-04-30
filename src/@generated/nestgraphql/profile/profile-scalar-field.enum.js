"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileScalarFieldEnum = void 0;
const graphql_1 = require("@nestjs/graphql");
var ProfileScalarFieldEnum;
(function (ProfileScalarFieldEnum) {
    ProfileScalarFieldEnum["id"] = "id";
    ProfileScalarFieldEnum["createdAt"] = "createdAt";
    ProfileScalarFieldEnum["updatedAt"] = "updatedAt";
    ProfileScalarFieldEnum["roles"] = "roles";
    ProfileScalarFieldEnum["status"] = "status";
    ProfileScalarFieldEnum["avatarUrl"] = "avatarUrl";
    ProfileScalarFieldEnum["name"] = "name";
    ProfileScalarFieldEnum["bio"] = "bio";
    ProfileScalarFieldEnum["totpEnabled"] = "totpEnabled";
    ProfileScalarFieldEnum["totpSecret"] = "totpSecret";
})(ProfileScalarFieldEnum = exports.ProfileScalarFieldEnum || (exports.ProfileScalarFieldEnum = {}));
(0, graphql_1.registerEnumType)(ProfileScalarFieldEnum, { name: 'ProfileScalarFieldEnum', description: undefined });
//# sourceMappingURL=profile-scalar-field.enum.js.map