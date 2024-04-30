"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSessionScalarFieldEnum = void 0;
const graphql_1 = require("@nestjs/graphql");
var AccountSessionScalarFieldEnum;
(function (AccountSessionScalarFieldEnum) {
    AccountSessionScalarFieldEnum["id"] = "id";
    AccountSessionScalarFieldEnum["createdAt"] = "createdAt";
    AccountSessionScalarFieldEnum["updatedAt"] = "updatedAt";
    AccountSessionScalarFieldEnum["accountId"] = "accountId";
    AccountSessionScalarFieldEnum["token"] = "token";
    AccountSessionScalarFieldEnum["ipAddr"] = "ipAddr";
    AccountSessionScalarFieldEnum["userAgent"] = "userAgent";
    AccountSessionScalarFieldEnum["expiresAt"] = "expiresAt";
})(AccountSessionScalarFieldEnum = exports.AccountSessionScalarFieldEnum || (exports.AccountSessionScalarFieldEnum = {}));
(0, graphql_1.registerEnumType)(AccountSessionScalarFieldEnum, { name: 'AccountSessionScalarFieldEnum', description: undefined });
//# sourceMappingURL=account-session-scalar-field.enum.js.map