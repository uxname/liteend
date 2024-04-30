"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NestedIntFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestedIntFilter = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const graphql_3 = require("@nestjs/graphql");
let NestedIntFilter = NestedIntFilter_1 = class NestedIntFilter {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], NestedIntFilter.prototype, "equals", void 0);
__decorate([
    (0, graphql_1.Field)(() => [graphql_3.Int], { nullable: true })
], NestedIntFilter.prototype, "in", void 0);
__decorate([
    (0, graphql_1.Field)(() => [graphql_3.Int], { nullable: true })
], NestedIntFilter.prototype, "notIn", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], NestedIntFilter.prototype, "lt", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], NestedIntFilter.prototype, "lte", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], NestedIntFilter.prototype, "gt", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], NestedIntFilter.prototype, "gte", void 0);
__decorate([
    (0, graphql_1.Field)(() => NestedIntFilter_1, { nullable: true })
], NestedIntFilter.prototype, "not", void 0);
NestedIntFilter = NestedIntFilter_1 = __decorate([
    (0, graphql_2.InputType)()
], NestedIntFilter);
exports.NestedIntFilter = NestedIntFilter;
//# sourceMappingURL=nested-int-filter.input.js.map