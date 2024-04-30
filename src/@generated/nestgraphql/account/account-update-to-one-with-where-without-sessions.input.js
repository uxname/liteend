"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountUpdateToOneWithWhereWithoutSessionsInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_where_input_1 = require("./account-where.input");
const class_transformer_1 = require("class-transformer");
const account_update_without_sessions_input_1 = require("./account-update-without-sessions.input");
let AccountUpdateToOneWithWhereWithoutSessionsInput = class AccountUpdateToOneWithWhereWithoutSessionsInput {
};
__decorate([
    (0, graphql_1.Field)(() => account_where_input_1.AccountWhereInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => account_where_input_1.AccountWhereInput)
], AccountUpdateToOneWithWhereWithoutSessionsInput.prototype, "where", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_update_without_sessions_input_1.AccountUpdateWithoutSessionsInput, { nullable: false }),
    (0, class_transformer_1.Type)(() => account_update_without_sessions_input_1.AccountUpdateWithoutSessionsInput)
], AccountUpdateToOneWithWhereWithoutSessionsInput.prototype, "data", void 0);
AccountUpdateToOneWithWhereWithoutSessionsInput = __decorate([
    (0, graphql_2.InputType)()
], AccountUpdateToOneWithWhereWithoutSessionsInput);
exports.AccountUpdateToOneWithWhereWithoutSessionsInput = AccountUpdateToOneWithWhereWithoutSessionsInput;
//# sourceMappingURL=account-update-to-one-with-where-without-sessions.input.js.map