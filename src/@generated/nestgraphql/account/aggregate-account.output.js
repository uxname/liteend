"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateAccount = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_count_aggregate_output_1 = require("./account-count-aggregate.output");
const account_avg_aggregate_output_1 = require("./account-avg-aggregate.output");
const account_sum_aggregate_output_1 = require("./account-sum-aggregate.output");
const account_min_aggregate_output_1 = require("./account-min-aggregate.output");
const account_max_aggregate_output_1 = require("./account-max-aggregate.output");
let AggregateAccount = class AggregateAccount {
};
__decorate([
    (0, graphql_1.Field)(() => account_count_aggregate_output_1.AccountCountAggregate, { nullable: true })
], AggregateAccount.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_avg_aggregate_output_1.AccountAvgAggregate, { nullable: true })
], AggregateAccount.prototype, "_avg", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_sum_aggregate_output_1.AccountSumAggregate, { nullable: true })
], AggregateAccount.prototype, "_sum", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_min_aggregate_output_1.AccountMinAggregate, { nullable: true })
], AggregateAccount.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_max_aggregate_output_1.AccountMaxAggregate, { nullable: true })
], AggregateAccount.prototype, "_max", void 0);
AggregateAccount = __decorate([
    (0, graphql_2.ObjectType)()
], AggregateAccount);
exports.AggregateAccount = AggregateAccount;
//# sourceMappingURL=aggregate-account.output.js.map