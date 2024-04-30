"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateAccountSession = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_session_count_aggregate_output_1 = require("./account-session-count-aggregate.output");
const account_session_avg_aggregate_output_1 = require("./account-session-avg-aggregate.output");
const account_session_sum_aggregate_output_1 = require("./account-session-sum-aggregate.output");
const account_session_min_aggregate_output_1 = require("./account-session-min-aggregate.output");
const account_session_max_aggregate_output_1 = require("./account-session-max-aggregate.output");
let AggregateAccountSession = class AggregateAccountSession {
};
__decorate([
    (0, graphql_1.Field)(() => account_session_count_aggregate_output_1.AccountSessionCountAggregate, { nullable: true })
], AggregateAccountSession.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_avg_aggregate_output_1.AccountSessionAvgAggregate, { nullable: true })
], AggregateAccountSession.prototype, "_avg", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_sum_aggregate_output_1.AccountSessionSumAggregate, { nullable: true })
], AggregateAccountSession.prototype, "_sum", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_min_aggregate_output_1.AccountSessionMinAggregate, { nullable: true })
], AggregateAccountSession.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_max_aggregate_output_1.AccountSessionMaxAggregate, { nullable: true })
], AggregateAccountSession.prototype, "_max", void 0);
AggregateAccountSession = __decorate([
    (0, graphql_2.ObjectType)()
], AggregateAccountSession);
exports.AggregateAccountSession = AggregateAccountSession;
//# sourceMappingURL=aggregate-account-session.output.js.map