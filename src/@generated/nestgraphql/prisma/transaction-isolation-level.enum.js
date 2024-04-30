"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionIsolationLevel = void 0;
const graphql_1 = require("@nestjs/graphql");
var TransactionIsolationLevel;
(function (TransactionIsolationLevel) {
    TransactionIsolationLevel["ReadUncommitted"] = "ReadUncommitted";
    TransactionIsolationLevel["ReadCommitted"] = "ReadCommitted";
    TransactionIsolationLevel["RepeatableRead"] = "RepeatableRead";
    TransactionIsolationLevel["Serializable"] = "Serializable";
})(TransactionIsolationLevel = exports.TransactionIsolationLevel || (exports.TransactionIsolationLevel = {}));
(0, graphql_1.registerEnumType)(TransactionIsolationLevel, { name: 'TransactionIsolationLevel', description: undefined });
//# sourceMappingURL=transaction-isolation-level.enum.js.map