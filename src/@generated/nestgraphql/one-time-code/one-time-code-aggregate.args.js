"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneTimeCodeAggregateArgs = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const one_time_code_where_input_1 = require("./one-time-code-where.input");
const class_transformer_1 = require("class-transformer");
const one_time_code_order_by_with_relation_input_1 = require("./one-time-code-order-by-with-relation.input");
const one_time_code_where_unique_input_1 = require("./one-time-code-where-unique.input");
const graphql_3 = require("@nestjs/graphql");
const one_time_code_count_aggregate_input_1 = require("./one-time-code-count-aggregate.input");
const one_time_code_avg_aggregate_input_1 = require("./one-time-code-avg-aggregate.input");
const one_time_code_sum_aggregate_input_1 = require("./one-time-code-sum-aggregate.input");
const one_time_code_min_aggregate_input_1 = require("./one-time-code-min-aggregate.input");
const one_time_code_max_aggregate_input_1 = require("./one-time-code-max-aggregate.input");
let OneTimeCodeAggregateArgs = class OneTimeCodeAggregateArgs {
};
__decorate([
    (0, graphql_1.Field)(() => one_time_code_where_input_1.OneTimeCodeWhereInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => one_time_code_where_input_1.OneTimeCodeWhereInput)
], OneTimeCodeAggregateArgs.prototype, "where", void 0);
__decorate([
    (0, graphql_1.Field)(() => [one_time_code_order_by_with_relation_input_1.OneTimeCodeOrderByWithRelationInput], { nullable: true })
], OneTimeCodeAggregateArgs.prototype, "orderBy", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_where_unique_input_1.OneTimeCodeWhereUniqueInput, { nullable: true })
], OneTimeCodeAggregateArgs.prototype, "cursor", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], OneTimeCodeAggregateArgs.prototype, "take", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], OneTimeCodeAggregateArgs.prototype, "skip", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_count_aggregate_input_1.OneTimeCodeCountAggregateInput, { nullable: true })
], OneTimeCodeAggregateArgs.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_avg_aggregate_input_1.OneTimeCodeAvgAggregateInput, { nullable: true })
], OneTimeCodeAggregateArgs.prototype, "_avg", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_sum_aggregate_input_1.OneTimeCodeSumAggregateInput, { nullable: true })
], OneTimeCodeAggregateArgs.prototype, "_sum", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_min_aggregate_input_1.OneTimeCodeMinAggregateInput, { nullable: true })
], OneTimeCodeAggregateArgs.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_max_aggregate_input_1.OneTimeCodeMaxAggregateInput, { nullable: true })
], OneTimeCodeAggregateArgs.prototype, "_max", void 0);
OneTimeCodeAggregateArgs = __decorate([
    (0, graphql_2.ArgsType)()
], OneTimeCodeAggregateArgs);
exports.OneTimeCodeAggregateArgs = OneTimeCodeAggregateArgs;
//# sourceMappingURL=one-time-code-aggregate.args.js.map