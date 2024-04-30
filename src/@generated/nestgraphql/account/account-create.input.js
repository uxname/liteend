"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountCreateInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_session_create_nested_many_without_account_input_1 = require("../account-session/account-session-create-nested-many-without-account.input");
const profile_create_nested_one_without_accounts_input_1 = require("../profile/profile-create-nested-one-without-accounts.input");
let AccountCreateInput = class AccountCreateInput {
};
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], AccountCreateInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], AccountCreateInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false })
], AccountCreateInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false })
], AccountCreateInput.prototype, "passwordHash", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_create_nested_many_without_account_input_1.AccountSessionCreateNestedManyWithoutAccountInput, { nullable: true })
], AccountCreateInput.prototype, "sessions", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_create_nested_one_without_accounts_input_1.ProfileCreateNestedOneWithoutAccountsInput, { nullable: true })
], AccountCreateInput.prototype, "profile", void 0);
AccountCreateInput = __decorate([
    (0, graphql_2.InputType)()
], AccountCreateInput);
exports.AccountCreateInput = AccountCreateInput;
//# sourceMappingURL=account-create.input.js.map