"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadGroupBy = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const graphql_3 = require("@nestjs/graphql");
const upload_count_aggregate_output_1 = require("./upload-count-aggregate.output");
const upload_avg_aggregate_output_1 = require("./upload-avg-aggregate.output");
const upload_sum_aggregate_output_1 = require("./upload-sum-aggregate.output");
const upload_min_aggregate_output_1 = require("./upload-min-aggregate.output");
const upload_max_aggregate_output_1 = require("./upload-max-aggregate.output");
let UploadGroupBy = class UploadGroupBy {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: false })
], UploadGroupBy.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: false })
], UploadGroupBy.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: false })
], UploadGroupBy.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false })
], UploadGroupBy.prototype, "filepath", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false })
], UploadGroupBy.prototype, "originalFilename", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false })
], UploadGroupBy.prototype, "extension", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: false })
], UploadGroupBy.prototype, "size", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false })
], UploadGroupBy.prototype, "mimetype", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false })
], UploadGroupBy.prototype, "uploaderIp", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_count_aggregate_output_1.UploadCountAggregate, { nullable: true })
], UploadGroupBy.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_avg_aggregate_output_1.UploadAvgAggregate, { nullable: true })
], UploadGroupBy.prototype, "_avg", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_sum_aggregate_output_1.UploadSumAggregate, { nullable: true })
], UploadGroupBy.prototype, "_sum", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_min_aggregate_output_1.UploadMinAggregate, { nullable: true })
], UploadGroupBy.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_max_aggregate_output_1.UploadMaxAggregate, { nullable: true })
], UploadGroupBy.prototype, "_max", void 0);
UploadGroupBy = __decorate([
    (0, graphql_2.ObjectType)()
], UploadGroupBy);
exports.UploadGroupBy = UploadGroupBy;
//# sourceMappingURL=upload-group-by.output.js.map