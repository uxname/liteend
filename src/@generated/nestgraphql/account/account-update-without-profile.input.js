"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountUpdateWithoutProfileInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_session_update_many_without_account_nested_input_1 = require("../account-session/account-session-update-many-without-account-nested.input");
let AccountUpdateWithoutProfileInput = class AccountUpdateWithoutProfileInput {
};
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], AccountUpdateWithoutProfileInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], AccountUpdateWithoutProfileInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], AccountUpdateWithoutProfileInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], AccountUpdateWithoutProfileInput.prototype, "passwordHash", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_update_many_without_account_nested_input_1.AccountSessionUpdateManyWithoutAccountNestedInput, { nullable: true })
], AccountUpdateWithoutProfileInput.prototype, "sessions", void 0);
AccountUpdateWithoutProfileInput = __decorate([
    (0, graphql_2.InputType)()
], AccountUpdateWithoutProfileInput);
exports.AccountUpdateWithoutProfileInput = AccountUpdateWithoutProfileInput;
//# sourceMappingURL=account-update-without-profile.input.js.map