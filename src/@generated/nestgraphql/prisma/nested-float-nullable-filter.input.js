"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NestedFloatNullableFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestedFloatNullableFilter = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const graphql_3 = require("@nestjs/graphql");
let NestedFloatNullableFilter = NestedFloatNullableFilter_1 = class NestedFloatNullableFilter {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Float, { nullable: true })
], NestedFloatNullableFilter.prototype, "equals", void 0);
__decorate([
    (0, graphql_1.Field)(() => [graphql_3.Float], { nullable: true })
], NestedFloatNullableFilter.prototype, "in", void 0);
__decorate([
    (0, graphql_1.Field)(() => [graphql_3.Float], { nullable: true })
], NestedFloatNullableFilter.prototype, "notIn", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Float, { nullable: true })
], NestedFloatNullableFilter.prototype, "lt", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Float, { nullable: true })
], NestedFloatNullableFilter.prototype, "lte", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Float, { nullable: true })
], NestedFloatNullableFilter.prototype, "gt", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Float, { nullable: true })
], NestedFloatNullableFilter.prototype, "gte", void 0);
__decorate([
    (0, graphql_1.Field)(() => NestedFloatNullableFilter_1, { nullable: true })
], NestedFloatNullableFilter.prototype, "not", void 0);
NestedFloatNullableFilter = NestedFloatNullableFilter_1 = __decorate([
    (0, graphql_2.InputType)()
], NestedFloatNullableFilter);
exports.NestedFloatNullableFilter = NestedFloatNullableFilter;
//# sourceMappingURL=nested-float-nullable-filter.input.js.map