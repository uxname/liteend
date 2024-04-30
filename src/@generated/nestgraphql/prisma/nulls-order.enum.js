"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullsOrder = void 0;
const graphql_1 = require("@nestjs/graphql");
var NullsOrder;
(function (NullsOrder) {
    NullsOrder["first"] = "first";
    NullsOrder["last"] = "last";
})(NullsOrder = exports.NullsOrder || (exports.NullsOrder = {}));
(0, graphql_1.registerEnumType)(NullsOrder, { name: 'NullsOrder', description: undefined });
//# sourceMappingURL=nulls-order.enum.js.map