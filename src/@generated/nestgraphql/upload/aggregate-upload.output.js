"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateUpload = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const upload_count_aggregate_output_1 = require("./upload-count-aggregate.output");
const upload_avg_aggregate_output_1 = require("./upload-avg-aggregate.output");
const upload_sum_aggregate_output_1 = require("./upload-sum-aggregate.output");
const upload_min_aggregate_output_1 = require("./upload-min-aggregate.output");
const upload_max_aggregate_output_1 = require("./upload-max-aggregate.output");
let AggregateUpload = class AggregateUpload {
};
__decorate([
    (0, graphql_1.Field)(() => upload_count_aggregate_output_1.UploadCountAggregate, { nullable: true })
], AggregateUpload.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_avg_aggregate_output_1.UploadAvgAggregate, { nullable: true })
], AggregateUpload.prototype, "_avg", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_sum_aggregate_output_1.UploadSumAggregate, { nullable: true })
], AggregateUpload.prototype, "_sum", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_min_aggregate_output_1.UploadMinAggregate, { nullable: true })
], AggregateUpload.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_max_aggregate_output_1.UploadMaxAggregate, { nullable: true })
], AggregateUpload.prototype, "_max", void 0);
AggregateUpload = __decorate([
    (0, graphql_2.ObjectType)()
], AggregateUpload);
exports.AggregateUpload = AggregateUpload;
//# sourceMappingURL=aggregate-upload.output.js.map