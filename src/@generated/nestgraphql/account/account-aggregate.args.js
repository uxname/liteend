"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountAggregateArgs = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_where_input_1 = require("./account-where.input");
const class_transformer_1 = require("class-transformer");
const account_order_by_with_relation_input_1 = require("./account-order-by-with-relation.input");
const account_where_unique_input_1 = require("./account-where-unique.input");
const graphql_3 = require("@nestjs/graphql");
const account_count_aggregate_input_1 = require("./account-count-aggregate.input");
const account_avg_aggregate_input_1 = require("./account-avg-aggregate.input");
const account_sum_aggregate_input_1 = require("./account-sum-aggregate.input");
const account_min_aggregate_input_1 = require("./account-min-aggregate.input");
const account_max_aggregate_input_1 = require("./account-max-aggregate.input");
let AccountAggregateArgs = class AccountAggregateArgs {
};
__decorate([
    (0, graphql_1.Field)(() => account_where_input_1.AccountWhereInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => account_where_input_1.AccountWhereInput)
], AccountAggregateArgs.prototype, "where", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_order_by_with_relation_input_1.AccountOrderByWithRelationInput], { nullable: true })
], AccountAggregateArgs.prototype, "orderBy", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_where_unique_input_1.AccountWhereUniqueInput, { nullable: true })
], AccountAggregateArgs.prototype, "cursor", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], AccountAggregateArgs.prototype, "take", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], AccountAggregateArgs.prototype, "skip", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_count_aggregate_input_1.AccountCountAggregateInput, { nullable: true })
], AccountAggregateArgs.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_avg_aggregate_input_1.AccountAvgAggregateInput, { nullable: true })
], AccountAggregateArgs.prototype, "_avg", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_sum_aggregate_input_1.AccountSumAggregateInput, { nullable: true })
], AccountAggregateArgs.prototype, "_sum", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_min_aggregate_input_1.AccountMinAggregateInput, { nullable: true })
], AccountAggregateArgs.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_max_aggregate_input_1.AccountMaxAggregateInput, { nullable: true })
], AccountAggregateArgs.prototype, "_max", void 0);
AccountAggregateArgs = __decorate([
    (0, graphql_2.ArgsType)()
], AccountAggregateArgs);
exports.AccountAggregateArgs = AccountAggregateArgs;
//# sourceMappingURL=account-aggregate.args.js.map