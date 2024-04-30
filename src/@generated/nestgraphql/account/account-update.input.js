"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountUpdateInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_session_update_many_without_account_nested_input_1 = require("../account-session/account-session-update-many-without-account-nested.input");
const profile_update_one_without_accounts_nested_input_1 = require("../profile/profile-update-one-without-accounts-nested.input");
let AccountUpdateInput = class AccountUpdateInput {
};
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], AccountUpdateInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], AccountUpdateInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], AccountUpdateInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], AccountUpdateInput.prototype, "passwordHash", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_update_many_without_account_nested_input_1.AccountSessionUpdateManyWithoutAccountNestedInput, { nullable: true })
], AccountUpdateInput.prototype, "sessions", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_update_one_without_accounts_nested_input_1.ProfileUpdateOneWithoutAccountsNestedInput, { nullable: true })
], AccountUpdateInput.prototype, "profile", void 0);
AccountUpdateInput = __decorate([
    (0, graphql_2.InputType)()
], AccountUpdateInput);
exports.AccountUpdateInput = AccountUpdateInput;
//# sourceMappingURL=account-update.input.js.map