"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountUncheckedUpdateInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const graphql_3 = require("@nestjs/graphql");
const account_session_unchecked_update_many_without_account_nested_input_1 = require("../account-session/account-session-unchecked-update-many-without-account-nested.input");
let AccountUncheckedUpdateInput = class AccountUncheckedUpdateInput {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], AccountUncheckedUpdateInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], AccountUncheckedUpdateInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], AccountUncheckedUpdateInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], AccountUncheckedUpdateInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], AccountUncheckedUpdateInput.prototype, "passwordHash", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], AccountUncheckedUpdateInput.prototype, "profileId", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_unchecked_update_many_without_account_nested_input_1.AccountSessionUncheckedUpdateManyWithoutAccountNestedInput, { nullable: true })
], AccountUncheckedUpdateInput.prototype, "sessions", void 0);
AccountUncheckedUpdateInput = __decorate([
    (0, graphql_2.InputType)()
], AccountUncheckedUpdateInput);
exports.AccountUncheckedUpdateInput = AccountUncheckedUpdateInput;
//# sourceMappingURL=account-unchecked-update.input.js.map