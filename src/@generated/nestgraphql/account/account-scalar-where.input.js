"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AccountScalarWhereInput_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountScalarWhereInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const int_filter_input_1 = require("../prisma/int-filter.input");
const date_time_filter_input_1 = require("../prisma/date-time-filter.input");
const string_filter_input_1 = require("../prisma/string-filter.input");
const int_nullable_filter_input_1 = require("../prisma/int-nullable-filter.input");
let AccountScalarWhereInput = AccountScalarWhereInput_1 = class AccountScalarWhereInput {
};
__decorate([
    (0, graphql_1.Field)(() => [AccountScalarWhereInput_1], { nullable: true })
], AccountScalarWhereInput.prototype, "AND", void 0);
__decorate([
    (0, graphql_1.Field)(() => [AccountScalarWhereInput_1], { nullable: true })
], AccountScalarWhereInput.prototype, "OR", void 0);
__decorate([
    (0, graphql_1.Field)(() => [AccountScalarWhereInput_1], { nullable: true })
], AccountScalarWhereInput.prototype, "NOT", void 0);
__decorate([
    (0, graphql_1.Field)(() => int_filter_input_1.IntFilter, { nullable: true })
], AccountScalarWhereInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_time_filter_input_1.DateTimeFilter, { nullable: true })
], AccountScalarWhereInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_time_filter_input_1.DateTimeFilter, { nullable: true })
], AccountScalarWhereInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_filter_input_1.StringFilter, { nullable: true })
], AccountScalarWhereInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_filter_input_1.StringFilter, { nullable: true })
], AccountScalarWhereInput.prototype, "passwordHash", void 0);
__decorate([
    (0, graphql_1.Field)(() => int_nullable_filter_input_1.IntNullableFilter, { nullable: true })
], AccountScalarWhereInput.prototype, "profileId", void 0);
AccountScalarWhereInput = AccountScalarWhereInput_1 = __decorate([
    (0, graphql_2.InputType)()
], AccountScalarWhereInput);
exports.AccountScalarWhereInput = AccountScalarWhereInput;
//# sourceMappingURL=account-scalar-where.input.js.map