"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountCreateOrConnectWithoutSessionsInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_where_unique_input_1 = require("./account-where-unique.input");
const class_transformer_1 = require("class-transformer");
const account_create_without_sessions_input_1 = require("./account-create-without-sessions.input");
let AccountCreateOrConnectWithoutSessionsInput = class AccountCreateOrConnectWithoutSessionsInput {
};
__decorate([
    (0, graphql_1.Field)(() => account_where_unique_input_1.AccountWhereUniqueInput, { nullable: false }),
    (0, class_transformer_1.Type)(() => account_where_unique_input_1.AccountWhereUniqueInput)
], AccountCreateOrConnectWithoutSessionsInput.prototype, "where", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_create_without_sessions_input_1.AccountCreateWithoutSessionsInput, { nullable: false }),
    (0, class_transformer_1.Type)(() => account_create_without_sessions_input_1.AccountCreateWithoutSessionsInput)
], AccountCreateOrConnectWithoutSessionsInput.prototype, "create", void 0);
AccountCreateOrConnectWithoutSessionsInput = __decorate([
    (0, graphql_2.InputType)()
], AccountCreateOrConnectWithoutSessionsInput);
exports.AccountCreateOrConnectWithoutSessionsInput = AccountCreateOrConnectWithoutSessionsInput;
//# sourceMappingURL=account-create-or-connect-without-sessions.input.js.map