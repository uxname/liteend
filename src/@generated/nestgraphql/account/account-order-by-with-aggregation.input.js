"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountOrderByWithAggregationInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const sort_order_enum_1 = require("../prisma/sort-order.enum");
const sort_order_input_1 = require("../prisma/sort-order.input");
const account_count_order_by_aggregate_input_1 = require("./account-count-order-by-aggregate.input");
const account_avg_order_by_aggregate_input_1 = require("./account-avg-order-by-aggregate.input");
const account_max_order_by_aggregate_input_1 = require("./account-max-order-by-aggregate.input");
const account_min_order_by_aggregate_input_1 = require("./account-min-order-by-aggregate.input");
const account_sum_order_by_aggregate_input_1 = require("./account-sum-order-by-aggregate.input");
let AccountOrderByWithAggregationInput = class AccountOrderByWithAggregationInput {
};
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountOrderByWithAggregationInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountOrderByWithAggregationInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountOrderByWithAggregationInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountOrderByWithAggregationInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountOrderByWithAggregationInput.prototype, "passwordHash", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_input_1.SortOrderInput, { nullable: true })
], AccountOrderByWithAggregationInput.prototype, "profileId", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_count_order_by_aggregate_input_1.AccountCountOrderByAggregateInput, { nullable: true })
], AccountOrderByWithAggregationInput.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_avg_order_by_aggregate_input_1.AccountAvgOrderByAggregateInput, { nullable: true })
], AccountOrderByWithAggregationInput.prototype, "_avg", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_max_order_by_aggregate_input_1.AccountMaxOrderByAggregateInput, { nullable: true })
], AccountOrderByWithAggregationInput.prototype, "_max", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_min_order_by_aggregate_input_1.AccountMinOrderByAggregateInput, { nullable: true })
], AccountOrderByWithAggregationInput.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_sum_order_by_aggregate_input_1.AccountSumOrderByAggregateInput, { nullable: true })
], AccountOrderByWithAggregationInput.prototype, "_sum", void 0);
AccountOrderByWithAggregationInput = __decorate([
    (0, graphql_2.InputType)()
], AccountOrderByWithAggregationInput);
exports.AccountOrderByWithAggregationInput = AccountOrderByWithAggregationInput;
//# sourceMappingURL=account-order-by-with-aggregation.input.js.map