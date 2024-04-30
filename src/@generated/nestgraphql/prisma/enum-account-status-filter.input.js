"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumAccountStatusFilter = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_status_enum_1 = require("./account-status.enum");
const nested_enum_account_status_filter_input_1 = require("./nested-enum-account-status-filter.input");
let EnumAccountStatusFilter = class EnumAccountStatusFilter {
};
__decorate([
    (0, graphql_1.Field)(() => account_status_enum_1.AccountStatus, { nullable: true })
], EnumAccountStatusFilter.prototype, "equals", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_status_enum_1.AccountStatus], { nullable: true })
], EnumAccountStatusFilter.prototype, "in", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_status_enum_1.AccountStatus], { nullable: true })
], EnumAccountStatusFilter.prototype, "notIn", void 0);
__decorate([
    (0, graphql_1.Field)(() => nested_enum_account_status_filter_input_1.NestedEnumAccountStatusFilter, { nullable: true })
], EnumAccountStatusFilter.prototype, "not", void 0);
EnumAccountStatusFilter = __decorate([
    (0, graphql_2.InputType)()
], EnumAccountStatusFilter);
exports.EnumAccountStatusFilter = EnumAccountStatusFilter;
//# sourceMappingURL=enum-account-status-filter.input.js.map