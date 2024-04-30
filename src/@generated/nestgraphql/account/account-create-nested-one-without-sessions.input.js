"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountCreateNestedOneWithoutSessionsInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_create_without_sessions_input_1 = require("./account-create-without-sessions.input");
const class_transformer_1 = require("class-transformer");
const account_create_or_connect_without_sessions_input_1 = require("./account-create-or-connect-without-sessions.input");
const account_where_unique_input_1 = require("./account-where-unique.input");
let AccountCreateNestedOneWithoutSessionsInput = class AccountCreateNestedOneWithoutSessionsInput {
};
__decorate([
    (0, graphql_1.Field)(() => account_create_without_sessions_input_1.AccountCreateWithoutSessionsInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => account_create_without_sessions_input_1.AccountCreateWithoutSessionsInput)
], AccountCreateNestedOneWithoutSessionsInput.prototype, "create", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_create_or_connect_without_sessions_input_1.AccountCreateOrConnectWithoutSessionsInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => account_create_or_connect_without_sessions_input_1.AccountCreateOrConnectWithoutSessionsInput)
], AccountCreateNestedOneWithoutSessionsInput.prototype, "connectOrCreate", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_where_unique_input_1.AccountWhereUniqueInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => account_where_unique_input_1.AccountWhereUniqueInput)
], AccountCreateNestedOneWithoutSessionsInput.prototype, "connect", void 0);
AccountCreateNestedOneWithoutSessionsInput = __decorate([
    (0, graphql_2.InputType)()
], AccountCreateNestedOneWithoutSessionsInput);
exports.AccountCreateNestedOneWithoutSessionsInput = AccountCreateNestedOneWithoutSessionsInput;
//# sourceMappingURL=account-create-nested-one-without-sessions.input.js.map