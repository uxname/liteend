"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneTimeCodeWhereUniqueInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const graphql_3 = require("@nestjs/graphql");
const one_time_code_where_input_1 = require("./one-time-code-where.input");
const date_time_filter_input_1 = require("../prisma/date-time-filter.input");
const string_filter_input_1 = require("../prisma/string-filter.input");
let OneTimeCodeWhereUniqueInput = class OneTimeCodeWhereUniqueInput {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], OneTimeCodeWhereUniqueInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], OneTimeCodeWhereUniqueInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(() => [one_time_code_where_input_1.OneTimeCodeWhereInput], { nullable: true })
], OneTimeCodeWhereUniqueInput.prototype, "AND", void 0);
__decorate([
    (0, graphql_1.Field)(() => [one_time_code_where_input_1.OneTimeCodeWhereInput], { nullable: true })
], OneTimeCodeWhereUniqueInput.prototype, "OR", void 0);
__decorate([
    (0, graphql_1.Field)(() => [one_time_code_where_input_1.OneTimeCodeWhereInput], { nullable: true })
], OneTimeCodeWhereUniqueInput.prototype, "NOT", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_time_filter_input_1.DateTimeFilter, { nullable: true })
], OneTimeCodeWhereUniqueInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_time_filter_input_1.DateTimeFilter, { nullable: true })
], OneTimeCodeWhereUniqueInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_filter_input_1.StringFilter, { nullable: true })
], OneTimeCodeWhereUniqueInput.prototype, "code", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_time_filter_input_1.DateTimeFilter, { nullable: true })
], OneTimeCodeWhereUniqueInput.prototype, "expiresAt", void 0);
OneTimeCodeWhereUniqueInput = __decorate([
    (0, graphql_2.InputType)()
], OneTimeCodeWhereUniqueInput);
exports.OneTimeCodeWhereUniqueInput = OneTimeCodeWhereUniqueInput;
//# sourceMappingURL=one-time-code-where-unique.input.js.map