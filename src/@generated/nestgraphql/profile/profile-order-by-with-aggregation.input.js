"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileOrderByWithAggregationInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const sort_order_enum_1 = require("../prisma/sort-order.enum");
const sort_order_input_1 = require("../prisma/sort-order.input");
const profile_count_order_by_aggregate_input_1 = require("./profile-count-order-by-aggregate.input");
const profile_avg_order_by_aggregate_input_1 = require("./profile-avg-order-by-aggregate.input");
const profile_max_order_by_aggregate_input_1 = require("./profile-max-order-by-aggregate.input");
const profile_min_order_by_aggregate_input_1 = require("./profile-min-order-by-aggregate.input");
const profile_sum_order_by_aggregate_input_1 = require("./profile-sum-order-by-aggregate.input");
let ProfileOrderByWithAggregationInput = class ProfileOrderByWithAggregationInput {
};
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], ProfileOrderByWithAggregationInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], ProfileOrderByWithAggregationInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], ProfileOrderByWithAggregationInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], ProfileOrderByWithAggregationInput.prototype, "roles", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], ProfileOrderByWithAggregationInput.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_input_1.SortOrderInput, { nullable: true })
], ProfileOrderByWithAggregationInput.prototype, "avatarUrl", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_input_1.SortOrderInput, { nullable: true })
], ProfileOrderByWithAggregationInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_input_1.SortOrderInput, { nullable: true })
], ProfileOrderByWithAggregationInput.prototype, "bio", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], ProfileOrderByWithAggregationInput.prototype, "totpEnabled", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_input_1.SortOrderInput, { nullable: true })
], ProfileOrderByWithAggregationInput.prototype, "totpSecret", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_count_order_by_aggregate_input_1.ProfileCountOrderByAggregateInput, { nullable: true })
], ProfileOrderByWithAggregationInput.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_avg_order_by_aggregate_input_1.ProfileAvgOrderByAggregateInput, { nullable: true })
], ProfileOrderByWithAggregationInput.prototype, "_avg", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_max_order_by_aggregate_input_1.ProfileMaxOrderByAggregateInput, { nullable: true })
], ProfileOrderByWithAggregationInput.prototype, "_max", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_min_order_by_aggregate_input_1.ProfileMinOrderByAggregateInput, { nullable: true })
], ProfileOrderByWithAggregationInput.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_sum_order_by_aggregate_input_1.ProfileSumOrderByAggregateInput, { nullable: true })
], ProfileOrderByWithAggregationInput.prototype, "_sum", void 0);
ProfileOrderByWithAggregationInput = __decorate([
    (0, graphql_2.InputType)()
], ProfileOrderByWithAggregationInput);
exports.ProfileOrderByWithAggregationInput = ProfileOrderByWithAggregationInput;
//# sourceMappingURL=profile-order-by-with-aggregation.input.js.map