"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadOrderByWithAggregationInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const sort_order_enum_1 = require("../prisma/sort-order.enum");
const upload_count_order_by_aggregate_input_1 = require("./upload-count-order-by-aggregate.input");
const upload_avg_order_by_aggregate_input_1 = require("./upload-avg-order-by-aggregate.input");
const upload_max_order_by_aggregate_input_1 = require("./upload-max-order-by-aggregate.input");
const upload_min_order_by_aggregate_input_1 = require("./upload-min-order-by-aggregate.input");
const upload_sum_order_by_aggregate_input_1 = require("./upload-sum-order-by-aggregate.input");
let UploadOrderByWithAggregationInput = class UploadOrderByWithAggregationInput {
};
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], UploadOrderByWithAggregationInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], UploadOrderByWithAggregationInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], UploadOrderByWithAggregationInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], UploadOrderByWithAggregationInput.prototype, "filepath", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], UploadOrderByWithAggregationInput.prototype, "originalFilename", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], UploadOrderByWithAggregationInput.prototype, "extension", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], UploadOrderByWithAggregationInput.prototype, "size", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], UploadOrderByWithAggregationInput.prototype, "mimetype", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], UploadOrderByWithAggregationInput.prototype, "uploaderIp", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_count_order_by_aggregate_input_1.UploadCountOrderByAggregateInput, { nullable: true })
], UploadOrderByWithAggregationInput.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_avg_order_by_aggregate_input_1.UploadAvgOrderByAggregateInput, { nullable: true })
], UploadOrderByWithAggregationInput.prototype, "_avg", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_max_order_by_aggregate_input_1.UploadMaxOrderByAggregateInput, { nullable: true })
], UploadOrderByWithAggregationInput.prototype, "_max", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_min_order_by_aggregate_input_1.UploadMinOrderByAggregateInput, { nullable: true })
], UploadOrderByWithAggregationInput.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_sum_order_by_aggregate_input_1.UploadSumOrderByAggregateInput, { nullable: true })
], UploadOrderByWithAggregationInput.prototype, "_sum", void 0);
UploadOrderByWithAggregationInput = __decorate([
    (0, graphql_2.InputType)()
], UploadOrderByWithAggregationInput);
exports.UploadOrderByWithAggregationInput = UploadOrderByWithAggregationInput;
//# sourceMappingURL=upload-order-by-with-aggregation.input.js.map