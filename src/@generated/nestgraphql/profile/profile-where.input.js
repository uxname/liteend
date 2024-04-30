"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProfileWhereInput_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileWhereInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const int_filter_input_1 = require("../prisma/int-filter.input");
const date_time_filter_input_1 = require("../prisma/date-time-filter.input");
const enum_profile_role_nullable_list_filter_input_1 = require("../prisma/enum-profile-role-nullable-list-filter.input");
const enum_account_status_filter_input_1 = require("../prisma/enum-account-status-filter.input");
const string_nullable_filter_input_1 = require("../prisma/string-nullable-filter.input");
const bool_filter_input_1 = require("../prisma/bool-filter.input");
const account_list_relation_filter_input_1 = require("../account/account-list-relation-filter.input");
let ProfileWhereInput = ProfileWhereInput_1 = class ProfileWhereInput {
};
__decorate([
    (0, graphql_1.Field)(() => [ProfileWhereInput_1], { nullable: true })
], ProfileWhereInput.prototype, "AND", void 0);
__decorate([
    (0, graphql_1.Field)(() => [ProfileWhereInput_1], { nullable: true })
], ProfileWhereInput.prototype, "OR", void 0);
__decorate([
    (0, graphql_1.Field)(() => [ProfileWhereInput_1], { nullable: true })
], ProfileWhereInput.prototype, "NOT", void 0);
__decorate([
    (0, graphql_1.Field)(() => int_filter_input_1.IntFilter, { nullable: true })
], ProfileWhereInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_time_filter_input_1.DateTimeFilter, { nullable: true })
], ProfileWhereInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_time_filter_input_1.DateTimeFilter, { nullable: true })
], ProfileWhereInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => enum_profile_role_nullable_list_filter_input_1.EnumProfileRoleNullableListFilter, { nullable: true })
], ProfileWhereInput.prototype, "roles", void 0);
__decorate([
    (0, graphql_1.Field)(() => enum_account_status_filter_input_1.EnumAccountStatusFilter, { nullable: true })
], ProfileWhereInput.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_nullable_filter_input_1.StringNullableFilter, { nullable: true })
], ProfileWhereInput.prototype, "avatarUrl", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_nullable_filter_input_1.StringNullableFilter, { nullable: true })
], ProfileWhereInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_nullable_filter_input_1.StringNullableFilter, { nullable: true })
], ProfileWhereInput.prototype, "bio", void 0);
__decorate([
    (0, graphql_1.Field)(() => bool_filter_input_1.BoolFilter, { nullable: true })
], ProfileWhereInput.prototype, "totpEnabled", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_nullable_filter_input_1.StringNullableFilter, { nullable: true })
], ProfileWhereInput.prototype, "totpSecret", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_list_relation_filter_input_1.AccountListRelationFilter, { nullable: true })
], ProfileWhereInput.prototype, "accounts", void 0);
ProfileWhereInput = ProfileWhereInput_1 = __decorate([
    (0, graphql_2.InputType)()
], ProfileWhereInput);
exports.ProfileWhereInput = ProfileWhereInput;
//# sourceMappingURL=profile-where.input.js.map