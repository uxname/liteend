"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AccountSessionScalarWhereWithAggregatesInput_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSessionScalarWhereWithAggregatesInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const int_with_aggregates_filter_input_1 = require("../prisma/int-with-aggregates-filter.input");
const date_time_with_aggregates_filter_input_1 = require("../prisma/date-time-with-aggregates-filter.input");
const string_with_aggregates_filter_input_1 = require("../prisma/string-with-aggregates-filter.input");
const string_nullable_with_aggregates_filter_input_1 = require("../prisma/string-nullable-with-aggregates-filter.input");
let AccountSessionScalarWhereWithAggregatesInput = AccountSessionScalarWhereWithAggregatesInput_1 = class AccountSessionScalarWhereWithAggregatesInput {
};
__decorate([
    (0, graphql_1.Field)(() => [AccountSessionScalarWhereWithAggregatesInput_1], { nullable: true })
], AccountSessionScalarWhereWithAggregatesInput.prototype, "AND", void 0);
__decorate([
    (0, graphql_1.Field)(() => [AccountSessionScalarWhereWithAggregatesInput_1], { nullable: true })
], AccountSessionScalarWhereWithAggregatesInput.prototype, "OR", void 0);
__decorate([
    (0, graphql_1.Field)(() => [AccountSessionScalarWhereWithAggregatesInput_1], { nullable: true })
], AccountSessionScalarWhereWithAggregatesInput.prototype, "NOT", void 0);
__decorate([
    (0, graphql_1.Field)(() => int_with_aggregates_filter_input_1.IntWithAggregatesFilter, { nullable: true })
], AccountSessionScalarWhereWithAggregatesInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_time_with_aggregates_filter_input_1.DateTimeWithAggregatesFilter, { nullable: true })
], AccountSessionScalarWhereWithAggregatesInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_time_with_aggregates_filter_input_1.DateTimeWithAggregatesFilter, { nullable: true })
], AccountSessionScalarWhereWithAggregatesInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => int_with_aggregates_filter_input_1.IntWithAggregatesFilter, { nullable: true })
], AccountSessionScalarWhereWithAggregatesInput.prototype, "accountId", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_with_aggregates_filter_input_1.StringWithAggregatesFilter, { nullable: true })
], AccountSessionScalarWhereWithAggregatesInput.prototype, "token", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_with_aggregates_filter_input_1.StringWithAggregatesFilter, { nullable: true })
], AccountSessionScalarWhereWithAggregatesInput.prototype, "ipAddr", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_nullable_with_aggregates_filter_input_1.StringNullableWithAggregatesFilter, { nullable: true })
], AccountSessionScalarWhereWithAggregatesInput.prototype, "userAgent", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_time_with_aggregates_filter_input_1.DateTimeWithAggregatesFilter, { nullable: true })
], AccountSessionScalarWhereWithAggregatesInput.prototype, "expiresAt", void 0);
AccountSessionScalarWhereWithAggregatesInput = AccountSessionScalarWhereWithAggregatesInput_1 = __decorate([
    (0, graphql_2.InputType)()
], AccountSessionScalarWhereWithAggregatesInput);
exports.AccountSessionScalarWhereWithAggregatesInput = AccountSessionScalarWhereWithAggregatesInput;
//# sourceMappingURL=account-session-scalar-where-with-aggregates.input.js.map