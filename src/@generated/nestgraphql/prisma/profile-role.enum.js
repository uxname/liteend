"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileRole = void 0;
const graphql_1 = require("@nestjs/graphql");
var ProfileRole;
(function (ProfileRole) {
    ProfileRole["ADMIN"] = "ADMIN";
    ProfileRole["USER"] = "USER";
})(ProfileRole = exports.ProfileRole || (exports.ProfileRole = {}));
(0, graphql_1.registerEnumType)(ProfileRole, { name: 'ProfileRole', description: undefined });
//# sourceMappingURL=profile-role.enum.js.map