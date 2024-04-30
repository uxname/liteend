"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountUncheckedCreateInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const graphql_3 = require("@nestjs/graphql");
const account_session_unchecked_create_nested_many_without_account_input_1 = require("../account-session/account-session-unchecked-create-nested-many-without-account.input");
let AccountUncheckedCreateInput = class AccountUncheckedCreateInput {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], AccountUncheckedCreateInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], AccountUncheckedCreateInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], AccountUncheckedCreateInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false })
], AccountUncheckedCreateInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false })
], AccountUncheckedCreateInput.prototype, "passwordHash", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], AccountUncheckedCreateInput.prototype, "profileId", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_unchecked_create_nested_many_without_account_input_1.AccountSessionUncheckedCreateNestedManyWithoutAccountInput, { nullable: true })
], AccountUncheckedCreateInput.prototype, "sessions", void 0);
AccountUncheckedCreateInput = __decorate([
    (0, graphql_2.InputType)()
], AccountUncheckedCreateInput);
exports.AccountUncheckedCreateInput = AccountUncheckedCreateInput;
//# sourceMappingURL=account-unchecked-create.input.js.map