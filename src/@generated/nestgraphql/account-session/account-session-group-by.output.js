"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSessionGroupBy = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const graphql_3 = require("@nestjs/graphql");
const graphql_4 = require("@nestjs/graphql");
const account_session_count_aggregate_output_1 = require("./account-session-count-aggregate.output");
const account_session_avg_aggregate_output_1 = require("./account-session-avg-aggregate.output");
const account_session_sum_aggregate_output_1 = require("./account-session-sum-aggregate.output");
const account_session_min_aggregate_output_1 = require("./account-session-min-aggregate.output");
const account_session_max_aggregate_output_1 = require("./account-session-max-aggregate.output");
let AccountSessionGroupBy = class AccountSessionGroupBy {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: false })
], AccountSessionGroupBy.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: false })
], AccountSessionGroupBy.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: false })
], AccountSessionGroupBy.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: false })
], AccountSessionGroupBy.prototype, "accountId", void 0);
__decorate([
    (0, graphql_4.HideField)()
], AccountSessionGroupBy.prototype, "token", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false })
], AccountSessionGroupBy.prototype, "ipAddr", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], AccountSessionGroupBy.prototype, "userAgent", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: false })
], AccountSessionGroupBy.prototype, "expiresAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_count_aggregate_output_1.AccountSessionCountAggregate, { nullable: true })
], AccountSessionGroupBy.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_avg_aggregate_output_1.AccountSessionAvgAggregate, { nullable: true })
], AccountSessionGroupBy.prototype, "_avg", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_sum_aggregate_output_1.AccountSessionSumAggregate, { nullable: true })
], AccountSessionGroupBy.prototype, "_sum", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_min_aggregate_output_1.AccountSessionMinAggregate, { nullable: true })
], AccountSessionGroupBy.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_max_aggregate_output_1.AccountSessionMaxAggregate, { nullable: true })
], AccountSessionGroupBy.prototype, "_max", void 0);
AccountSessionGroupBy = __decorate([
    (0, graphql_2.ObjectType)()
], AccountSessionGroupBy);
exports.AccountSessionGroupBy = AccountSessionGroupBy;
//# sourceMappingURL=account-session-group-by.output.js.map