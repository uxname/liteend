"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSessionWhereUniqueInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const graphql_3 = require("@nestjs/graphql");
const account_session_where_input_1 = require("./account-session-where.input");
const date_time_filter_input_1 = require("../prisma/date-time-filter.input");
const int_filter_input_1 = require("../prisma/int-filter.input");
const string_filter_input_1 = require("../prisma/string-filter.input");
const string_nullable_filter_input_1 = require("../prisma/string-nullable-filter.input");
const account_relation_filter_input_1 = require("../account/account-relation-filter.input");
let AccountSessionWhereUniqueInput = class AccountSessionWhereUniqueInput {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], AccountSessionWhereUniqueInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], AccountSessionWhereUniqueInput.prototype, "token", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_session_where_input_1.AccountSessionWhereInput], { nullable: true })
], AccountSessionWhereUniqueInput.prototype, "AND", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_session_where_input_1.AccountSessionWhereInput], { nullable: true })
], AccountSessionWhereUniqueInput.prototype, "OR", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_session_where_input_1.AccountSessionWhereInput], { nullable: true })
], AccountSessionWhereUniqueInput.prototype, "NOT", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_time_filter_input_1.DateTimeFilter, { nullable: true })
], AccountSessionWhereUniqueInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_time_filter_input_1.DateTimeFilter, { nullable: true })
], AccountSessionWhereUniqueInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => int_filter_input_1.IntFilter, { nullable: true })
], AccountSessionWhereUniqueInput.prototype, "accountId", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_filter_input_1.StringFilter, { nullable: true })
], AccountSessionWhereUniqueInput.prototype, "ipAddr", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_nullable_filter_input_1.StringNullableFilter, { nullable: true })
], AccountSessionWhereUniqueInput.prototype, "userAgent", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_time_filter_input_1.DateTimeFilter, { nullable: true })
], AccountSessionWhereUniqueInput.prototype, "expiresAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_relation_filter_input_1.AccountRelationFilter, { nullable: true })
], AccountSessionWhereUniqueInput.prototype, "account", void 0);
AccountSessionWhereUniqueInput = __decorate([
    (0, graphql_2.InputType)()
], AccountSessionWhereUniqueInput);
exports.AccountSessionWhereUniqueInput = AccountSessionWhereUniqueInput;
//# sourceMappingURL=account-session-where-unique.input.js.map