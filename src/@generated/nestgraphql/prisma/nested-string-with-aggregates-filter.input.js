"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NestedStringWithAggregatesFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestedStringWithAggregatesFilter = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const nested_int_filter_input_1 = require("./nested-int-filter.input");
const nested_string_filter_input_1 = require("./nested-string-filter.input");
let NestedStringWithAggregatesFilter = NestedStringWithAggregatesFilter_1 = class NestedStringWithAggregatesFilter {
};
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], NestedStringWithAggregatesFilter.prototype, "equals", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true })
], NestedStringWithAggregatesFilter.prototype, "in", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true })
], NestedStringWithAggregatesFilter.prototype, "notIn", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], NestedStringWithAggregatesFilter.prototype, "lt", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], NestedStringWithAggregatesFilter.prototype, "lte", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], NestedStringWithAggregatesFilter.prototype, "gt", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], NestedStringWithAggregatesFilter.prototype, "gte", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], NestedStringWithAggregatesFilter.prototype, "contains", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], NestedStringWithAggregatesFilter.prototype, "startsWith", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], NestedStringWithAggregatesFilter.prototype, "endsWith", void 0);
__decorate([
    (0, graphql_1.Field)(() => NestedStringWithAggregatesFilter_1, { nullable: true })
], NestedStringWithAggregatesFilter.prototype, "not", void 0);
__decorate([
    (0, graphql_1.Field)(() => nested_int_filter_input_1.NestedIntFilter, { nullable: true })
], NestedStringWithAggregatesFilter.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => nested_string_filter_input_1.NestedStringFilter, { nullable: true })
], NestedStringWithAggregatesFilter.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => nested_string_filter_input_1.NestedStringFilter, { nullable: true })
], NestedStringWithAggregatesFilter.prototype, "_max", void 0);
NestedStringWithAggregatesFilter = NestedStringWithAggregatesFilter_1 = __decorate([
    (0, graphql_2.InputType)()
], NestedStringWithAggregatesFilter);
exports.NestedStringWithAggregatesFilter = NestedStringWithAggregatesFilter;
//# sourceMappingURL=nested-string-with-aggregates-filter.input.js.map