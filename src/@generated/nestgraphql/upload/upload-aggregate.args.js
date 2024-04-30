"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadAggregateArgs = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const upload_where_input_1 = require("./upload-where.input");
const class_transformer_1 = require("class-transformer");
const upload_order_by_with_relation_input_1 = require("./upload-order-by-with-relation.input");
const upload_where_unique_input_1 = require("./upload-where-unique.input");
const graphql_3 = require("@nestjs/graphql");
const upload_count_aggregate_input_1 = require("./upload-count-aggregate.input");
const upload_avg_aggregate_input_1 = require("./upload-avg-aggregate.input");
const upload_sum_aggregate_input_1 = require("./upload-sum-aggregate.input");
const upload_min_aggregate_input_1 = require("./upload-min-aggregate.input");
const upload_max_aggregate_input_1 = require("./upload-max-aggregate.input");
let UploadAggregateArgs = class UploadAggregateArgs {
};
__decorate([
    (0, graphql_1.Field)(() => upload_where_input_1.UploadWhereInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => upload_where_input_1.UploadWhereInput)
], UploadAggregateArgs.prototype, "where", void 0);
__decorate([
    (0, graphql_1.Field)(() => [upload_order_by_with_relation_input_1.UploadOrderByWithRelationInput], { nullable: true })
], UploadAggregateArgs.prototype, "orderBy", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_where_unique_input_1.UploadWhereUniqueInput, { nullable: true })
], UploadAggregateArgs.prototype, "cursor", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], UploadAggregateArgs.prototype, "take", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], UploadAggregateArgs.prototype, "skip", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_count_aggregate_input_1.UploadCountAggregateInput, { nullable: true })
], UploadAggregateArgs.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_avg_aggregate_input_1.UploadAvgAggregateInput, { nullable: true })
], UploadAggregateArgs.prototype, "_avg", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_sum_aggregate_input_1.UploadSumAggregateInput, { nullable: true })
], UploadAggregateArgs.prototype, "_sum", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_min_aggregate_input_1.UploadMinAggregateInput, { nullable: true })
], UploadAggregateArgs.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_max_aggregate_input_1.UploadMaxAggregateInput, { nullable: true })
], UploadAggregateArgs.prototype, "_max", void 0);
UploadAggregateArgs = __decorate([
    (0, graphql_2.ArgsType)()
], UploadAggregateArgs);
exports.UploadAggregateArgs = UploadAggregateArgs;
//# sourceMappingURL=upload-aggregate.args.js.map