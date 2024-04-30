"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneTimeCodeOrderByWithAggregationInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const sort_order_enum_1 = require("../prisma/sort-order.enum");
const one_time_code_count_order_by_aggregate_input_1 = require("./one-time-code-count-order-by-aggregate.input");
const one_time_code_avg_order_by_aggregate_input_1 = require("./one-time-code-avg-order-by-aggregate.input");
const one_time_code_max_order_by_aggregate_input_1 = require("./one-time-code-max-order-by-aggregate.input");
const one_time_code_min_order_by_aggregate_input_1 = require("./one-time-code-min-order-by-aggregate.input");
const one_time_code_sum_order_by_aggregate_input_1 = require("./one-time-code-sum-order-by-aggregate.input");
let OneTimeCodeOrderByWithAggregationInput = class OneTimeCodeOrderByWithAggregationInput {
};
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], OneTimeCodeOrderByWithAggregationInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], OneTimeCodeOrderByWithAggregationInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], OneTimeCodeOrderByWithAggregationInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], OneTimeCodeOrderByWithAggregationInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], OneTimeCodeOrderByWithAggregationInput.prototype, "code", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], OneTimeCodeOrderByWithAggregationInput.prototype, "expiresAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_count_order_by_aggregate_input_1.OneTimeCodeCountOrderByAggregateInput, { nullable: true })
], OneTimeCodeOrderByWithAggregationInput.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_avg_order_by_aggregate_input_1.OneTimeCodeAvgOrderByAggregateInput, { nullable: true })
], OneTimeCodeOrderByWithAggregationInput.prototype, "_avg", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_max_order_by_aggregate_input_1.OneTimeCodeMaxOrderByAggregateInput, { nullable: true })
], OneTimeCodeOrderByWithAggregationInput.prototype, "_max", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_min_order_by_aggregate_input_1.OneTimeCodeMinOrderByAggregateInput, { nullable: true })
], OneTimeCodeOrderByWithAggregationInput.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_sum_order_by_aggregate_input_1.OneTimeCodeSumOrderByAggregateInput, { nullable: true })
], OneTimeCodeOrderByWithAggregationInput.prototype, "_sum", void 0);
OneTimeCodeOrderByWithAggregationInput = __decorate([
    (0, graphql_2.InputType)()
], OneTimeCodeOrderByWithAggregationInput);
exports.OneTimeCodeOrderByWithAggregationInput = OneTimeCodeOrderByWithAggregationInput;
//# sourceMappingURL=one-time-code-order-by-with-aggregation.input.js.map