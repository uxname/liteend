"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NestedEnumAccountStatusFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestedEnumAccountStatusFilter = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_status_enum_1 = require("./account-status.enum");
let NestedEnumAccountStatusFilter = NestedEnumAccountStatusFilter_1 = class NestedEnumAccountStatusFilter {
};
__decorate([
    (0, graphql_1.Field)(() => account_status_enum_1.AccountStatus, { nullable: true })
], NestedEnumAccountStatusFilter.prototype, "equals", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_status_enum_1.AccountStatus], { nullable: true })
], NestedEnumAccountStatusFilter.prototype, "in", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_status_enum_1.AccountStatus], { nullable: true })
], NestedEnumAccountStatusFilter.prototype, "notIn", void 0);
__decorate([
    (0, graphql_1.Field)(() => NestedEnumAccountStatusFilter_1, { nullable: true })
], NestedEnumAccountStatusFilter.prototype, "not", void 0);
NestedEnumAccountStatusFilter = NestedEnumAccountStatusFilter_1 = __decorate([
    (0, graphql_2.InputType)()
], NestedEnumAccountStatusFilter);
exports.NestedEnumAccountStatusFilter = NestedEnumAccountStatusFilter;
//# sourceMappingURL=nested-enum-account-status-filter.input.js.map