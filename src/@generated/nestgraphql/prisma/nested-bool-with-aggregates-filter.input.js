"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NestedBoolWithAggregatesFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestedBoolWithAggregatesFilter = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const nested_int_filter_input_1 = require("./nested-int-filter.input");
const nested_bool_filter_input_1 = require("./nested-bool-filter.input");
let NestedBoolWithAggregatesFilter = NestedBoolWithAggregatesFilter_1 = class NestedBoolWithAggregatesFilter {
};
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], NestedBoolWithAggregatesFilter.prototype, "equals", void 0);
__decorate([
    (0, graphql_1.Field)(() => NestedBoolWithAggregatesFilter_1, { nullable: true })
], NestedBoolWithAggregatesFilter.prototype, "not", void 0);
__decorate([
    (0, graphql_1.Field)(() => nested_int_filter_input_1.NestedIntFilter, { nullable: true })
], NestedBoolWithAggregatesFilter.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => nested_bool_filter_input_1.NestedBoolFilter, { nullable: true })
], NestedBoolWithAggregatesFilter.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => nested_bool_filter_input_1.NestedBoolFilter, { nullable: true })
], NestedBoolWithAggregatesFilter.prototype, "_max", void 0);
NestedBoolWithAggregatesFilter = NestedBoolWithAggregatesFilter_1 = __decorate([
    (0, graphql_2.InputType)()
], NestedBoolWithAggregatesFilter);
exports.NestedBoolWithAggregatesFilter = NestedBoolWithAggregatesFilter;
//# sourceMappingURL=nested-bool-with-aggregates-filter.input.js.map