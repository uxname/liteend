"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AccountSessionWhereInput_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSessionWhereInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const int_filter_input_1 = require("../prisma/int-filter.input");
const date_time_filter_input_1 = require("../prisma/date-time-filter.input");
const string_filter_input_1 = require("../prisma/string-filter.input");
const string_nullable_filter_input_1 = require("../prisma/string-nullable-filter.input");
const account_relation_filter_input_1 = require("../account/account-relation-filter.input");
let AccountSessionWhereInput = AccountSessionWhereInput_1 = class AccountSessionWhereInput {
};
__decorate([
    (0, graphql_1.Field)(() => [AccountSessionWhereInput_1], { nullable: true })
], AccountSessionWhereInput.prototype, "AND", void 0);
__decorate([
    (0, graphql_1.Field)(() => [AccountSessionWhereInput_1], { nullable: true })
], AccountSessionWhereInput.prototype, "OR", void 0);
__decorate([
    (0, graphql_1.Field)(() => [AccountSessionWhereInput_1], { nullable: true })
], AccountSessionWhereInput.prototype, "NOT", void 0);
__decorate([
    (0, graphql_1.Field)(() => int_filter_input_1.IntFilter, { nullable: true })
], AccountSessionWhereInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_time_filter_input_1.DateTimeFilter, { nullable: true })
], AccountSessionWhereInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_time_filter_input_1.DateTimeFilter, { nullable: true })
], AccountSessionWhereInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => int_filter_input_1.IntFilter, { nullable: true })
], AccountSessionWhereInput.prototype, "accountId", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_filter_input_1.StringFilter, { nullable: true })
], AccountSessionWhereInput.prototype, "token", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_filter_input_1.StringFilter, { nullable: true })
], AccountSessionWhereInput.prototype, "ipAddr", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_nullable_filter_input_1.StringNullableFilter, { nullable: true })
], AccountSessionWhereInput.prototype, "userAgent", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_time_filter_input_1.DateTimeFilter, { nullable: true })
], AccountSessionWhereInput.prototype, "expiresAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_relation_filter_input_1.AccountRelationFilter, { nullable: true })
], AccountSessionWhereInput.prototype, "account", void 0);
AccountSessionWhereInput = AccountSessionWhereInput_1 = __decorate([
    (0, graphql_2.InputType)()
], AccountSessionWhereInput);
exports.AccountSessionWhereInput = AccountSessionWhereInput;
//# sourceMappingURL=account-session-where.input.js.map