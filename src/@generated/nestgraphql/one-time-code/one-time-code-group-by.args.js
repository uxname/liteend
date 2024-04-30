"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneTimeCodeGroupByArgs = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const one_time_code_where_input_1 = require("./one-time-code-where.input");
const class_transformer_1 = require("class-transformer");
const one_time_code_order_by_with_aggregation_input_1 = require("./one-time-code-order-by-with-aggregation.input");
const one_time_code_scalar_field_enum_1 = require("./one-time-code-scalar-field.enum");
const one_time_code_scalar_where_with_aggregates_input_1 = require("./one-time-code-scalar-where-with-aggregates.input");
const graphql_3 = require("@nestjs/graphql");
const one_time_code_count_aggregate_input_1 = require("./one-time-code-count-aggregate.input");
const one_time_code_avg_aggregate_input_1 = require("./one-time-code-avg-aggregate.input");
const one_time_code_sum_aggregate_input_1 = require("./one-time-code-sum-aggregate.input");
const one_time_code_min_aggregate_input_1 = require("./one-time-code-min-aggregate.input");
const one_time_code_max_aggregate_input_1 = require("./one-time-code-max-aggregate.input");
let OneTimeCodeGroupByArgs = class OneTimeCodeGroupByArgs {
};
__decorate([
    (0, graphql_1.Field)(() => one_time_code_where_input_1.OneTimeCodeWhereInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => one_time_code_where_input_1.OneTimeCodeWhereInput)
], OneTimeCodeGroupByArgs.prototype, "where", void 0);
__decorate([
    (0, graphql_1.Field)(() => [one_time_code_order_by_with_aggregation_input_1.OneTimeCodeOrderByWithAggregationInput], { nullable: true })
], OneTimeCodeGroupByArgs.prototype, "orderBy", void 0);
__decorate([
    (0, graphql_1.Field)(() => [one_time_code_scalar_field_enum_1.OneTimeCodeScalarFieldEnum], { nullable: false })
], OneTimeCodeGroupByArgs.prototype, "by", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_scalar_where_with_aggregates_input_1.OneTimeCodeScalarWhereWithAggregatesInput, { nullable: true })
], OneTimeCodeGroupByArgs.prototype, "having", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], OneTimeCodeGroupByArgs.prototype, "take", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], OneTimeCodeGroupByArgs.prototype, "skip", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_count_aggregate_input_1.OneTimeCodeCountAggregateInput, { nullable: true })
], OneTimeCodeGroupByArgs.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_avg_aggregate_input_1.OneTimeCodeAvgAggregateInput, { nullable: true })
], OneTimeCodeGroupByArgs.prototype, "_avg", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_sum_aggregate_input_1.OneTimeCodeSumAggregateInput, { nullable: true })
], OneTimeCodeGroupByArgs.prototype, "_sum", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_min_aggregate_input_1.OneTimeCodeMinAggregateInput, { nullable: true })
], OneTimeCodeGroupByArgs.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_max_aggregate_input_1.OneTimeCodeMaxAggregateInput, { nullable: true })
], OneTimeCodeGroupByArgs.prototype, "_max", void 0);
OneTimeCodeGroupByArgs = __decorate([
    (0, graphql_2.ArgsType)()
], OneTimeCodeGroupByArgs);
exports.OneTimeCodeGroupByArgs = OneTimeCodeGroupByArgs;
//# sourceMappingURL=one-time-code-group-by.args.js.map