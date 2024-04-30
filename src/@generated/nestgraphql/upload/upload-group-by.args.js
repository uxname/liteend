"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadGroupByArgs = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const upload_where_input_1 = require("./upload-where.input");
const class_transformer_1 = require("class-transformer");
const upload_order_by_with_aggregation_input_1 = require("./upload-order-by-with-aggregation.input");
const upload_scalar_field_enum_1 = require("./upload-scalar-field.enum");
const upload_scalar_where_with_aggregates_input_1 = require("./upload-scalar-where-with-aggregates.input");
const graphql_3 = require("@nestjs/graphql");
const upload_count_aggregate_input_1 = require("./upload-count-aggregate.input");
const upload_avg_aggregate_input_1 = require("./upload-avg-aggregate.input");
const upload_sum_aggregate_input_1 = require("./upload-sum-aggregate.input");
const upload_min_aggregate_input_1 = require("./upload-min-aggregate.input");
const upload_max_aggregate_input_1 = require("./upload-max-aggregate.input");
let UploadGroupByArgs = class UploadGroupByArgs {
};
__decorate([
    (0, graphql_1.Field)(() => upload_where_input_1.UploadWhereInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => upload_where_input_1.UploadWhereInput)
], UploadGroupByArgs.prototype, "where", void 0);
__decorate([
    (0, graphql_1.Field)(() => [upload_order_by_with_aggregation_input_1.UploadOrderByWithAggregationInput], { nullable: true })
], UploadGroupByArgs.prototype, "orderBy", void 0);
__decorate([
    (0, graphql_1.Field)(() => [upload_scalar_field_enum_1.UploadScalarFieldEnum], { nullable: false })
], UploadGroupByArgs.prototype, "by", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_scalar_where_with_aggregates_input_1.UploadScalarWhereWithAggregatesInput, { nullable: true })
], UploadGroupByArgs.prototype, "having", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], UploadGroupByArgs.prototype, "take", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], UploadGroupByArgs.prototype, "skip", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_count_aggregate_input_1.UploadCountAggregateInput, { nullable: true })
], UploadGroupByArgs.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_avg_aggregate_input_1.UploadAvgAggregateInput, { nullable: true })
], UploadGroupByArgs.prototype, "_avg", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_sum_aggregate_input_1.UploadSumAggregateInput, { nullable: true })
], UploadGroupByArgs.prototype, "_sum", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_min_aggregate_input_1.UploadMinAggregateInput, { nullable: true })
], UploadGroupByArgs.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_max_aggregate_input_1.UploadMaxAggregateInput, { nullable: true })
], UploadGroupByArgs.prototype, "_max", void 0);
UploadGroupByArgs = __decorate([
    (0, graphql_2.ArgsType)()
], UploadGroupByArgs);
exports.UploadGroupByArgs = UploadGroupByArgs;
//# sourceMappingURL=upload-group-by.args.js.map