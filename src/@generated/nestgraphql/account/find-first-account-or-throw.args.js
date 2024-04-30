"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindFirstAccountOrThrowArgs = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_where_input_1 = require("./account-where.input");
const class_transformer_1 = require("class-transformer");
const account_order_by_with_relation_input_1 = require("./account-order-by-with-relation.input");
const account_where_unique_input_1 = require("./account-where-unique.input");
const graphql_3 = require("@nestjs/graphql");
const account_scalar_field_enum_1 = require("./account-scalar-field.enum");
let FindFirstAccountOrThrowArgs = class FindFirstAccountOrThrowArgs {
};
__decorate([
    (0, graphql_1.Field)(() => account_where_input_1.AccountWhereInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => account_where_input_1.AccountWhereInput)
], FindFirstAccountOrThrowArgs.prototype, "where", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_order_by_with_relation_input_1.AccountOrderByWithRelationInput], { nullable: true })
], FindFirstAccountOrThrowArgs.prototype, "orderBy", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_where_unique_input_1.AccountWhereUniqueInput, { nullable: true })
], FindFirstAccountOrThrowArgs.prototype, "cursor", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], FindFirstAccountOrThrowArgs.prototype, "take", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], FindFirstAccountOrThrowArgs.prototype, "skip", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_scalar_field_enum_1.AccountScalarFieldEnum], { nullable: true })
], FindFirstAccountOrThrowArgs.prototype, "distinct", void 0);
FindFirstAccountOrThrowArgs = __decorate([
    (0, graphql_2.ArgsType)()
], FindFirstAccountOrThrowArgs);
exports.FindFirstAccountOrThrowArgs = FindFirstAccountOrThrowArgs;
//# sourceMappingURL=find-first-account-or-throw.args.js.map