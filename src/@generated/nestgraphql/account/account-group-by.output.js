"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountGroupBy = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const graphql_3 = require("@nestjs/graphql");
const graphql_4 = require("@nestjs/graphql");
const account_count_aggregate_output_1 = require("./account-count-aggregate.output");
const account_avg_aggregate_output_1 = require("./account-avg-aggregate.output");
const account_sum_aggregate_output_1 = require("./account-sum-aggregate.output");
const account_min_aggregate_output_1 = require("./account-min-aggregate.output");
const account_max_aggregate_output_1 = require("./account-max-aggregate.output");
let AccountGroupBy = class AccountGroupBy {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: false })
], AccountGroupBy.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: false })
], AccountGroupBy.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: false })
], AccountGroupBy.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false })
], AccountGroupBy.prototype, "email", void 0);
__decorate([
    (0, graphql_4.HideField)()
], AccountGroupBy.prototype, "passwordHash", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], AccountGroupBy.prototype, "profileId", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_count_aggregate_output_1.AccountCountAggregate, { nullable: true })
], AccountGroupBy.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_avg_aggregate_output_1.AccountAvgAggregate, { nullable: true })
], AccountGroupBy.prototype, "_avg", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_sum_aggregate_output_1.AccountSumAggregate, { nullable: true })
], AccountGroupBy.prototype, "_sum", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_min_aggregate_output_1.AccountMinAggregate, { nullable: true })
], AccountGroupBy.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_max_aggregate_output_1.AccountMaxAggregate, { nullable: true })
], AccountGroupBy.prototype, "_max", void 0);
AccountGroupBy = __decorate([
    (0, graphql_2.ObjectType)()
], AccountGroupBy);
exports.AccountGroupBy = AccountGroupBy;
//# sourceMappingURL=account-group-by.output.js.map