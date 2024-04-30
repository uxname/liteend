"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSessionAggregateArgs = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_session_where_input_1 = require("./account-session-where.input");
const class_transformer_1 = require("class-transformer");
const account_session_order_by_with_relation_input_1 = require("./account-session-order-by-with-relation.input");
const account_session_where_unique_input_1 = require("./account-session-where-unique.input");
const graphql_3 = require("@nestjs/graphql");
const account_session_count_aggregate_input_1 = require("./account-session-count-aggregate.input");
const account_session_avg_aggregate_input_1 = require("./account-session-avg-aggregate.input");
const account_session_sum_aggregate_input_1 = require("./account-session-sum-aggregate.input");
const account_session_min_aggregate_input_1 = require("./account-session-min-aggregate.input");
const account_session_max_aggregate_input_1 = require("./account-session-max-aggregate.input");
let AccountSessionAggregateArgs = class AccountSessionAggregateArgs {
};
__decorate([
    (0, graphql_1.Field)(() => account_session_where_input_1.AccountSessionWhereInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => account_session_where_input_1.AccountSessionWhereInput)
], AccountSessionAggregateArgs.prototype, "where", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_session_order_by_with_relation_input_1.AccountSessionOrderByWithRelationInput], { nullable: true })
], AccountSessionAggregateArgs.prototype, "orderBy", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_where_unique_input_1.AccountSessionWhereUniqueInput, { nullable: true })
], AccountSessionAggregateArgs.prototype, "cursor", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], AccountSessionAggregateArgs.prototype, "take", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], AccountSessionAggregateArgs.prototype, "skip", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_count_aggregate_input_1.AccountSessionCountAggregateInput, { nullable: true })
], AccountSessionAggregateArgs.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_avg_aggregate_input_1.AccountSessionAvgAggregateInput, { nullable: true })
], AccountSessionAggregateArgs.prototype, "_avg", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_sum_aggregate_input_1.AccountSessionSumAggregateInput, { nullable: true })
], AccountSessionAggregateArgs.prototype, "_sum", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_min_aggregate_input_1.AccountSessionMinAggregateInput, { nullable: true })
], AccountSessionAggregateArgs.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_max_aggregate_input_1.AccountSessionMaxAggregateInput, { nullable: true })
], AccountSessionAggregateArgs.prototype, "_max", void 0);
AccountSessionAggregateArgs = __decorate([
    (0, graphql_2.ArgsType)()
], AccountSessionAggregateArgs);
exports.AccountSessionAggregateArgs = AccountSessionAggregateArgs;
//# sourceMappingURL=account-session-aggregate.args.js.map