"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProfileScalarWhereWithAggregatesInput_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileScalarWhereWithAggregatesInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const int_with_aggregates_filter_input_1 = require("../prisma/int-with-aggregates-filter.input");
const date_time_with_aggregates_filter_input_1 = require("../prisma/date-time-with-aggregates-filter.input");
const enum_profile_role_nullable_list_filter_input_1 = require("../prisma/enum-profile-role-nullable-list-filter.input");
const enum_account_status_with_aggregates_filter_input_1 = require("../prisma/enum-account-status-with-aggregates-filter.input");
const string_nullable_with_aggregates_filter_input_1 = require("../prisma/string-nullable-with-aggregates-filter.input");
const bool_with_aggregates_filter_input_1 = require("../prisma/bool-with-aggregates-filter.input");
let ProfileScalarWhereWithAggregatesInput = ProfileScalarWhereWithAggregatesInput_1 = class ProfileScalarWhereWithAggregatesInput {
};
__decorate([
    (0, graphql_1.Field)(() => [ProfileScalarWhereWithAggregatesInput_1], { nullable: true })
], ProfileScalarWhereWithAggregatesInput.prototype, "AND", void 0);
__decorate([
    (0, graphql_1.Field)(() => [ProfileScalarWhereWithAggregatesInput_1], { nullable: true })
], ProfileScalarWhereWithAggregatesInput.prototype, "OR", void 0);
__decorate([
    (0, graphql_1.Field)(() => [ProfileScalarWhereWithAggregatesInput_1], { nullable: true })
], ProfileScalarWhereWithAggregatesInput.prototype, "NOT", void 0);
__decorate([
    (0, graphql_1.Field)(() => int_with_aggregates_filter_input_1.IntWithAggregatesFilter, { nullable: true })
], ProfileScalarWhereWithAggregatesInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_time_with_aggregates_filter_input_1.DateTimeWithAggregatesFilter, { nullable: true })
], ProfileScalarWhereWithAggregatesInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_time_with_aggregates_filter_input_1.DateTimeWithAggregatesFilter, { nullable: true })
], ProfileScalarWhereWithAggregatesInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => enum_profile_role_nullable_list_filter_input_1.EnumProfileRoleNullableListFilter, { nullable: true })
], ProfileScalarWhereWithAggregatesInput.prototype, "roles", void 0);
__decorate([
    (0, graphql_1.Field)(() => enum_account_status_with_aggregates_filter_input_1.EnumAccountStatusWithAggregatesFilter, { nullable: true })
], ProfileScalarWhereWithAggregatesInput.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_nullable_with_aggregates_filter_input_1.StringNullableWithAggregatesFilter, { nullable: true })
], ProfileScalarWhereWithAggregatesInput.prototype, "avatarUrl", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_nullable_with_aggregates_filter_input_1.StringNullableWithAggregatesFilter, { nullable: true })
], ProfileScalarWhereWithAggregatesInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_nullable_with_aggregates_filter_input_1.StringNullableWithAggregatesFilter, { nullable: true })
], ProfileScalarWhereWithAggregatesInput.prototype, "bio", void 0);
__decorate([
    (0, graphql_1.Field)(() => bool_with_aggregates_filter_input_1.BoolWithAggregatesFilter, { nullable: true })
], ProfileScalarWhereWithAggregatesInput.prototype, "totpEnabled", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_nullable_with_aggregates_filter_input_1.StringNullableWithAggregatesFilter, { nullable: true })
], ProfileScalarWhereWithAggregatesInput.prototype, "totpSecret", void 0);
ProfileScalarWhereWithAggregatesInput = ProfileScalarWhereWithAggregatesInput_1 = __decorate([
    (0, graphql_2.InputType)()
], ProfileScalarWhereWithAggregatesInput);
exports.ProfileScalarWhereWithAggregatesInput = ProfileScalarWhereWithAggregatesInput;
//# sourceMappingURL=profile-scalar-where-with-aggregates.input.js.map