"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneTimeCodeScalarFieldEnum = void 0;
const graphql_1 = require("@nestjs/graphql");
var OneTimeCodeScalarFieldEnum;
(function (OneTimeCodeScalarFieldEnum) {
    OneTimeCodeScalarFieldEnum["id"] = "id";
    OneTimeCodeScalarFieldEnum["createdAt"] = "createdAt";
    OneTimeCodeScalarFieldEnum["updatedAt"] = "updatedAt";
    OneTimeCodeScalarFieldEnum["email"] = "email";
    OneTimeCodeScalarFieldEnum["code"] = "code";
    OneTimeCodeScalarFieldEnum["expiresAt"] = "expiresAt";
})(OneTimeCodeScalarFieldEnum = exports.OneTimeCodeScalarFieldEnum || (exports.OneTimeCodeScalarFieldEnum = {}));
(0, graphql_1.registerEnumType)(OneTimeCodeScalarFieldEnum, { name: 'OneTimeCodeScalarFieldEnum', description: undefined });
//# sourceMappingURL=one-time-code-scalar-field.enum.js.map