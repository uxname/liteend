"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryMode = void 0;
const graphql_1 = require("@nestjs/graphql");
var QueryMode;
(function (QueryMode) {
    QueryMode["default"] = "default";
    QueryMode["insensitive"] = "insensitive";
})(QueryMode = exports.QueryMode || (exports.QueryMode = {}));
(0, graphql_1.registerEnumType)(QueryMode, { name: 'QueryMode', description: undefined });
//# sourceMappingURL=query-mode.enum.js.map