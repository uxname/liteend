"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AccountWhereInput_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountWhereInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const int_filter_input_1 = require("../prisma/int-filter.input");
const date_time_filter_input_1 = require("../prisma/date-time-filter.input");
const string_filter_input_1 = require("../prisma/string-filter.input");
const int_nullable_filter_input_1 = require("../prisma/int-nullable-filter.input");
const account_session_list_relation_filter_input_1 = require("../account-session/account-session-list-relation-filter.input");
const profile_nullable_relation_filter_input_1 = require("../profile/profile-nullable-relation-filter.input");
let AccountWhereInput = AccountWhereInput_1 = class AccountWhereInput {
};
__decorate([
    (0, graphql_1.Field)(() => [AccountWhereInput_1], { nullable: true })
], AccountWhereInput.prototype, "AND", void 0);
__decorate([
    (0, graphql_1.Field)(() => [AccountWhereInput_1], { nullable: true })
], AccountWhereInput.prototype, "OR", void 0);
__decorate([
    (0, graphql_1.Field)(() => [AccountWhereInput_1], { nullable: true })
], AccountWhereInput.prototype, "NOT", void 0);
__decorate([
    (0, graphql_1.Field)(() => int_filter_input_1.IntFilter, { nullable: true })
], AccountWhereInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_time_filter_input_1.DateTimeFilter, { nullable: true })
], AccountWhereInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_time_filter_input_1.DateTimeFilter, { nullable: true })
], AccountWhereInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_filter_input_1.StringFilter, { nullable: true })
], AccountWhereInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_filter_input_1.StringFilter, { nullable: true })
], AccountWhereInput.prototype, "passwordHash", void 0);
__decorate([
    (0, graphql_1.Field)(() => int_nullable_filter_input_1.IntNullableFilter, { nullable: true })
], AccountWhereInput.prototype, "profileId", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_list_relation_filter_input_1.AccountSessionListRelationFilter, { nullable: true })
], AccountWhereInput.prototype, "sessions", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_nullable_relation_filter_input_1.ProfileNullableRelationFilter, { nullable: true })
], AccountWhereInput.prototype, "profile", void 0);
AccountWhereInput = AccountWhereInput_1 = __decorate([
    (0, graphql_2.InputType)()
], AccountWhereInput);
exports.AccountWhereInput = AccountWhereInput;
//# sourceMappingURL=account-where.input.js.map