"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindManyOneTimeCodeArgs = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const one_time_code_where_input_1 = require("./one-time-code-where.input");
const class_transformer_1 = require("class-transformer");
const one_time_code_order_by_with_relation_input_1 = require("./one-time-code-order-by-with-relation.input");
const one_time_code_where_unique_input_1 = require("./one-time-code-where-unique.input");
const graphql_3 = require("@nestjs/graphql");
const one_time_code_scalar_field_enum_1 = require("./one-time-code-scalar-field.enum");
let FindManyOneTimeCodeArgs = class FindManyOneTimeCodeArgs {
};
__decorate([
    (0, graphql_1.Field)(() => one_time_code_where_input_1.OneTimeCodeWhereInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => one_time_code_where_input_1.OneTimeCodeWhereInput)
], FindManyOneTimeCodeArgs.prototype, "where", void 0);
__decorate([
    (0, graphql_1.Field)(() => [one_time_code_order_by_with_relation_input_1.OneTimeCodeOrderByWithRelationInput], { nullable: true })
], FindManyOneTimeCodeArgs.prototype, "orderBy", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_where_unique_input_1.OneTimeCodeWhereUniqueInput, { nullable: true })
], FindManyOneTimeCodeArgs.prototype, "cursor", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], FindManyOneTimeCodeArgs.prototype, "take", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], FindManyOneTimeCodeArgs.prototype, "skip", void 0);
__decorate([
    (0, graphql_1.Field)(() => [one_time_code_scalar_field_enum_1.OneTimeCodeScalarFieldEnum], { nullable: true })
], FindManyOneTimeCodeArgs.prototype, "distinct", void 0);
FindManyOneTimeCodeArgs = __decorate([
    (0, graphql_2.ArgsType)()
], FindManyOneTimeCodeArgs);
exports.FindManyOneTimeCodeArgs = FindManyOneTimeCodeArgs;
//# sourceMappingURL=find-many-one-time-code.args.js.map