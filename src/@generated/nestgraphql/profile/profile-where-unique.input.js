"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileWhereUniqueInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const graphql_3 = require("@nestjs/graphql");
const profile_where_input_1 = require("./profile-where.input");
const date_time_filter_input_1 = require("../prisma/date-time-filter.input");
const enum_profile_role_nullable_list_filter_input_1 = require("../prisma/enum-profile-role-nullable-list-filter.input");
const enum_account_status_filter_input_1 = require("../prisma/enum-account-status-filter.input");
const string_nullable_filter_input_1 = require("../prisma/string-nullable-filter.input");
const bool_filter_input_1 = require("../prisma/bool-filter.input");
const account_list_relation_filter_input_1 = require("../account/account-list-relation-filter.input");
let ProfileWhereUniqueInput = class ProfileWhereUniqueInput {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], ProfileWhereUniqueInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => [profile_where_input_1.ProfileWhereInput], { nullable: true })
], ProfileWhereUniqueInput.prototype, "AND", void 0);
__decorate([
    (0, graphql_1.Field)(() => [profile_where_input_1.ProfileWhereInput], { nullable: true })
], ProfileWhereUniqueInput.prototype, "OR", void 0);
__decorate([
    (0, graphql_1.Field)(() => [profile_where_input_1.ProfileWhereInput], { nullable: true })
], ProfileWhereUniqueInput.prototype, "NOT", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_time_filter_input_1.DateTimeFilter, { nullable: true })
], ProfileWhereUniqueInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_time_filter_input_1.DateTimeFilter, { nullable: true })
], ProfileWhereUniqueInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => enum_profile_role_nullable_list_filter_input_1.EnumProfileRoleNullableListFilter, { nullable: true })
], ProfileWhereUniqueInput.prototype, "roles", void 0);
__decorate([
    (0, graphql_1.Field)(() => enum_account_status_filter_input_1.EnumAccountStatusFilter, { nullable: true })
], ProfileWhereUniqueInput.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_nullable_filter_input_1.StringNullableFilter, { nullable: true })
], ProfileWhereUniqueInput.prototype, "avatarUrl", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_nullable_filter_input_1.StringNullableFilter, { nullable: true })
], ProfileWhereUniqueInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_nullable_filter_input_1.StringNullableFilter, { nullable: true })
], ProfileWhereUniqueInput.prototype, "bio", void 0);
__decorate([
    (0, graphql_1.Field)(() => bool_filter_input_1.BoolFilter, { nullable: true })
], ProfileWhereUniqueInput.prototype, "totpEnabled", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_nullable_filter_input_1.StringNullableFilter, { nullable: true })
], ProfileWhereUniqueInput.prototype, "totpSecret", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_list_relation_filter_input_1.AccountListRelationFilter, { nullable: true })
], ProfileWhereUniqueInput.prototype, "accounts", void 0);
ProfileWhereUniqueInput = __decorate([
    (0, graphql_2.InputType)()
], ProfileWhereUniqueInput);
exports.ProfileWhereUniqueInput = ProfileWhereUniqueInput;
//# sourceMappingURL=profile-where-unique.input.js.map