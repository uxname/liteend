"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSessionUpdateInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_update_one_required_without_sessions_nested_input_1 = require("../account/account-update-one-required-without-sessions-nested.input");
let AccountSessionUpdateInput = class AccountSessionUpdateInput {
};
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], AccountSessionUpdateInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], AccountSessionUpdateInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], AccountSessionUpdateInput.prototype, "token", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], AccountSessionUpdateInput.prototype, "ipAddr", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], AccountSessionUpdateInput.prototype, "userAgent", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], AccountSessionUpdateInput.prototype, "expiresAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_update_one_required_without_sessions_nested_input_1.AccountUpdateOneRequiredWithoutSessionsNestedInput, { nullable: true })
], AccountSessionUpdateInput.prototype, "account", void 0);
AccountSessionUpdateInput = __decorate([
    (0, graphql_2.InputType)()
], AccountSessionUpdateInput);
exports.AccountSessionUpdateInput = AccountSessionUpdateInput;
//# sourceMappingURL=account-session-update.input.js.map