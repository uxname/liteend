"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NestedBoolFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestedBoolFilter = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
let NestedBoolFilter = NestedBoolFilter_1 = class NestedBoolFilter {
};
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], NestedBoolFilter.prototype, "equals", void 0);
__decorate([
    (0, graphql_1.Field)(() => NestedBoolFilter_1, { nullable: true })
], NestedBoolFilter.prototype, "not", void 0);
NestedBoolFilter = NestedBoolFilter_1 = __decorate([
    (0, graphql_2.InputType)()
], NestedBoolFilter);
exports.NestedBoolFilter = NestedBoolFilter;
//# sourceMappingURL=nested-bool-filter.input.js.map