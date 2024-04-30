"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountCreateWithoutSessionsInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const profile_create_nested_one_without_accounts_input_1 = require("../profile/profile-create-nested-one-without-accounts.input");
let AccountCreateWithoutSessionsInput = class AccountCreateWithoutSessionsInput {
};
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], AccountCreateWithoutSessionsInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], AccountCreateWithoutSessionsInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false })
], AccountCreateWithoutSessionsInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false })
], AccountCreateWithoutSessionsInput.prototype, "passwordHash", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_create_nested_one_without_accounts_input_1.ProfileCreateNestedOneWithoutAccountsInput, { nullable: true })
], AccountCreateWithoutSessionsInput.prototype, "profile", void 0);
AccountCreateWithoutSessionsInput = __decorate([
    (0, graphql_2.InputType)()
], AccountCreateWithoutSessionsInput);
exports.AccountCreateWithoutSessionsInput = AccountCreateWithoutSessionsInput;
//# sourceMappingURL=account-create-without-sessions.input.js.map