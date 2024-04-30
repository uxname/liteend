"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSessionOrderByWithAggregationInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const sort_order_enum_1 = require("../prisma/sort-order.enum");
const sort_order_input_1 = require("../prisma/sort-order.input");
const account_session_count_order_by_aggregate_input_1 = require("./account-session-count-order-by-aggregate.input");
const account_session_avg_order_by_aggregate_input_1 = require("./account-session-avg-order-by-aggregate.input");
const account_session_max_order_by_aggregate_input_1 = require("./account-session-max-order-by-aggregate.input");
const account_session_min_order_by_aggregate_input_1 = require("./account-session-min-order-by-aggregate.input");
const account_session_sum_order_by_aggregate_input_1 = require("./account-session-sum-order-by-aggregate.input");
let AccountSessionOrderByWithAggregationInput = class AccountSessionOrderByWithAggregationInput {
};
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountSessionOrderByWithAggregationInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountSessionOrderByWithAggregationInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountSessionOrderByWithAggregationInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountSessionOrderByWithAggregationInput.prototype, "accountId", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountSessionOrderByWithAggregationInput.prototype, "token", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountSessionOrderByWithAggregationInput.prototype, "ipAddr", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_input_1.SortOrderInput, { nullable: true })
], AccountSessionOrderByWithAggregationInput.prototype, "userAgent", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountSessionOrderByWithAggregationInput.prototype, "expiresAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_count_order_by_aggregate_input_1.AccountSessionCountOrderByAggregateInput, { nullable: true })
], AccountSessionOrderByWithAggregationInput.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_avg_order_by_aggregate_input_1.AccountSessionAvgOrderByAggregateInput, { nullable: true })
], AccountSessionOrderByWithAggregationInput.prototype, "_avg", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_max_order_by_aggregate_input_1.AccountSessionMaxOrderByAggregateInput, { nullable: true })
], AccountSessionOrderByWithAggregationInput.prototype, "_max", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_min_order_by_aggregate_input_1.AccountSessionMinOrderByAggregateInput, { nullable: true })
], AccountSessionOrderByWithAggregationInput.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_sum_order_by_aggregate_input_1.AccountSessionSumOrderByAggregateInput, { nullable: true })
], AccountSessionOrderByWithAggregationInput.prototype, "_sum", void 0);
AccountSessionOrderByWithAggregationInput = __decorate([
    (0, graphql_2.InputType)()
], AccountSessionOrderByWithAggregationInput);
exports.AccountSessionOrderByWithAggregationInput = AccountSessionOrderByWithAggregationInput;
//# sourceMappingURL=account-session-order-by-with-aggregation.input.js.map