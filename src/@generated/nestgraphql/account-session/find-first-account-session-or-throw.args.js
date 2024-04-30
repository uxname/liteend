"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindFirstAccountSessionOrThrowArgs = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_session_where_input_1 = require("./account-session-where.input");
const class_transformer_1 = require("class-transformer");
const account_session_order_by_with_relation_input_1 = require("./account-session-order-by-with-relation.input");
const account_session_where_unique_input_1 = require("./account-session-where-unique.input");
const graphql_3 = require("@nestjs/graphql");
const account_session_scalar_field_enum_1 = require("./account-session-scalar-field.enum");
let FindFirstAccountSessionOrThrowArgs = class FindFirstAccountSessionOrThrowArgs {
};
__decorate([
    (0, graphql_1.Field)(() => account_session_where_input_1.AccountSessionWhereInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => account_session_where_input_1.AccountSessionWhereInput)
], FindFirstAccountSessionOrThrowArgs.prototype, "where", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_session_order_by_with_relation_input_1.AccountSessionOrderByWithRelationInput], { nullable: true })
], FindFirstAccountSessionOrThrowArgs.prototype, "orderBy", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_where_unique_input_1.AccountSessionWhereUniqueInput, { nullable: true })
], FindFirstAccountSessionOrThrowArgs.prototype, "cursor", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], FindFirstAccountSessionOrThrowArgs.prototype, "take", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], FindFirstAccountSessionOrThrowArgs.prototype, "skip", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_session_scalar_field_enum_1.AccountSessionScalarFieldEnum], { nullable: true })
], FindFirstAccountSessionOrThrowArgs.prototype, "distinct", void 0);
FindFirstAccountSessionOrThrowArgs = __decorate([
    (0, graphql_2.ArgsType)()
], FindFirstAccountSessionOrThrowArgs);
exports.FindFirstAccountSessionOrThrowArgs = FindFirstAccountSessionOrThrowArgs;
//# sourceMappingURL=find-first-account-session-or-throw.args.js.map