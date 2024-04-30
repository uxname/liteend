"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountGroupByArgs = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_where_input_1 = require("./account-where.input");
const class_transformer_1 = require("class-transformer");
const account_order_by_with_aggregation_input_1 = require("./account-order-by-with-aggregation.input");
const account_scalar_field_enum_1 = require("./account-scalar-field.enum");
const account_scalar_where_with_aggregates_input_1 = require("./account-scalar-where-with-aggregates.input");
const graphql_3 = require("@nestjs/graphql");
const account_count_aggregate_input_1 = require("./account-count-aggregate.input");
const account_avg_aggregate_input_1 = require("./account-avg-aggregate.input");
const account_sum_aggregate_input_1 = require("./account-sum-aggregate.input");
const account_min_aggregate_input_1 = require("./account-min-aggregate.input");
const account_max_aggregate_input_1 = require("./account-max-aggregate.input");
let AccountGroupByArgs = class AccountGroupByArgs {
};
__decorate([
    (0, graphql_1.Field)(() => account_where_input_1.AccountWhereInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => account_where_input_1.AccountWhereInput)
], AccountGroupByArgs.prototype, "where", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_order_by_with_aggregation_input_1.AccountOrderByWithAggregationInput], { nullable: true })
], AccountGroupByArgs.prototype, "orderBy", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_scalar_field_enum_1.AccountScalarFieldEnum], { nullable: false })
], AccountGroupByArgs.prototype, "by", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_scalar_where_with_aggregates_input_1.AccountScalarWhereWithAggregatesInput, { nullable: true })
], AccountGroupByArgs.prototype, "having", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], AccountGroupByArgs.prototype, "take", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], AccountGroupByArgs.prototype, "skip", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_count_aggregate_input_1.AccountCountAggregateInput, { nullable: true })
], AccountGroupByArgs.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_avg_aggregate_input_1.AccountAvgAggregateInput, { nullable: true })
], AccountGroupByArgs.prototype, "_avg", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_sum_aggregate_input_1.AccountSumAggregateInput, { nullable: true })
], AccountGroupByArgs.prototype, "_sum", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_min_aggregate_input_1.AccountMinAggregateInput, { nullable: true })
], AccountGroupByArgs.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_max_aggregate_input_1.AccountMaxAggregateInput, { nullable: true })
], AccountGroupByArgs.prototype, "_max", void 0);
AccountGroupByArgs = __decorate([
    (0, graphql_2.ArgsType)()
], AccountGroupByArgs);
exports.AccountGroupByArgs = AccountGroupByArgs;
//# sourceMappingURL=account-group-by.args.js.map