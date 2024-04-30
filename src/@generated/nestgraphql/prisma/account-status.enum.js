"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStatus = void 0;
const graphql_1 = require("@nestjs/graphql");
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "ACTIVE";
    AccountStatus["INACTIVE"] = "INACTIVE";
    AccountStatus["DELETED"] = "DELETED";
})(AccountStatus = exports.AccountStatus || (exports.AccountStatus = {}));
(0, graphql_1.registerEnumType)(AccountStatus, { name: 'AccountStatus', description: undefined });
//# sourceMappingURL=account-status.enum.js.map