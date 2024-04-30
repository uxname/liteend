"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoolWithAggregatesFilter = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const nested_bool_with_aggregates_filter_input_1 = require("./nested-bool-with-aggregates-filter.input");
const nested_int_filter_input_1 = require("./nested-int-filter.input");
const nested_bool_filter_input_1 = require("./nested-bool-filter.input");
let BoolWithAggregatesFilter = class BoolWithAggregatesFilter {
};
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], BoolWithAggregatesFilter.prototype, "equals", void 0);
__decorate([
    (0, graphql_1.Field)(() => nested_bool_with_aggregates_filter_input_1.NestedBoolWithAggregatesFilter, { nullable: true })
], BoolWithAggregatesFilter.prototype, "not", void 0);
__decorate([
    (0, graphql_1.Field)(() => nested_int_filter_input_1.NestedIntFilter, { nullable: true })
], BoolWithAggregatesFilter.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => nested_bool_filter_input_1.NestedBoolFilter, { nullable: true })
], BoolWithAggregatesFilter.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => nested_bool_filter_input_1.NestedBoolFilter, { nullable: true })
], BoolWithAggregatesFilter.prototype, "_max", void 0);
BoolWithAggregatesFilter = __decorate([
    (0, graphql_2.InputType)()
], BoolWithAggregatesFilter);
exports.BoolWithAggregatesFilter = BoolWithAggregatesFilter;
//# sourceMappingURL=bool-with-aggregates-filter.input.js.map