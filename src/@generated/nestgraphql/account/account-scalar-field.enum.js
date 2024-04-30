"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountScalarFieldEnum = void 0;
const graphql_1 = require("@nestjs/graphql");
var AccountScalarFieldEnum;
(function (AccountScalarFieldEnum) {
    AccountScalarFieldEnum["id"] = "id";
    AccountScalarFieldEnum["createdAt"] = "createdAt";
    AccountScalarFieldEnum["updatedAt"] = "updatedAt";
    AccountScalarFieldEnum["email"] = "email";
    AccountScalarFieldEnum["passwordHash"] = "passwordHash";
    AccountScalarFieldEnum["profileId"] = "profileId";
})(AccountScalarFieldEnum = exports.AccountScalarFieldEnum || (exports.AccountScalarFieldEnum = {}));
(0, graphql_1.registerEnumType)(AccountScalarFieldEnum, { name: 'AccountScalarFieldEnum', description: undefined });
//# sourceMappingURL=account-scalar-field.enum.js.map