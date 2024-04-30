"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateOneTimeCode = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const one_time_code_count_aggregate_output_1 = require("./one-time-code-count-aggregate.output");
const one_time_code_avg_aggregate_output_1 = require("./one-time-code-avg-aggregate.output");
const one_time_code_sum_aggregate_output_1 = require("./one-time-code-sum-aggregate.output");
const one_time_code_min_aggregate_output_1 = require("./one-time-code-min-aggregate.output");
const one_time_code_max_aggregate_output_1 = require("./one-time-code-max-aggregate.output");
let AggregateOneTimeCode = class AggregateOneTimeCode {
};
__decorate([
    (0, graphql_1.Field)(() => one_time_code_count_aggregate_output_1.OneTimeCodeCountAggregate, { nullable: true })
], AggregateOneTimeCode.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_avg_aggregate_output_1.OneTimeCodeAvgAggregate, { nullable: true })
], AggregateOneTimeCode.prototype, "_avg", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_sum_aggregate_output_1.OneTimeCodeSumAggregate, { nullable: true })
], AggregateOneTimeCode.prototype, "_sum", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_min_aggregate_output_1.OneTimeCodeMinAggregate, { nullable: true })
], AggregateOneTimeCode.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_max_aggregate_output_1.OneTimeCodeMaxAggregate, { nullable: true })
], AggregateOneTimeCode.prototype, "_max", void 0);
AggregateOneTimeCode = __decorate([
    (0, graphql_2.ObjectType)()
], AggregateOneTimeCode);
exports.AggregateOneTimeCode = AggregateOneTimeCode;
//# sourceMappingURL=aggregate-one-time-code.output.js.map