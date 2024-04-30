"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindManyAccountArgs = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_where_input_1 = require("./account-where.input");
const class_transformer_1 = require("class-transformer");
const account_order_by_with_relation_input_1 = require("./account-order-by-with-relation.input");
const account_where_unique_input_1 = require("./account-where-unique.input");
const graphql_3 = require("@nestjs/graphql");
const account_scalar_field_enum_1 = require("./account-scalar-field.enum");
let FindManyAccountArgs = class FindManyAccountArgs {
};
__decorate([
    (0, graphql_1.Field)(() => account_where_input_1.AccountWhereInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => account_where_input_1.AccountWhereInput)
], FindManyAccountArgs.prototype, "where", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_order_by_with_relation_input_1.AccountOrderByWithRelationInput], { nullable: true })
], FindManyAccountArgs.prototype, "orderBy", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_where_unique_input_1.AccountWhereUniqueInput, { nullable: true })
], FindManyAccountArgs.prototype, "cursor", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], FindManyAccountArgs.prototype, "take", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], FindManyAccountArgs.prototype, "skip", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_scalar_field_enum_1.AccountScalarFieldEnum], { nullable: true })
], FindManyAccountArgs.prototype, "distinct", void 0);
FindManyAccountArgs = __decorate([
    (0, graphql_2.ArgsType)()
], FindManyAccountArgs);
exports.FindManyAccountArgs = FindManyAccountArgs;
//# sourceMappingURL=find-many-account.args.js.map