"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSessionCreateInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_create_nested_one_without_sessions_input_1 = require("../account/account-create-nested-one-without-sessions.input");
let AccountSessionCreateInput = class AccountSessionCreateInput {
};
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], AccountSessionCreateInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], AccountSessionCreateInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false })
], AccountSessionCreateInput.prototype, "token", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false })
], AccountSessionCreateInput.prototype, "ipAddr", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], AccountSessionCreateInput.prototype, "userAgent", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: false })
], AccountSessionCreateInput.prototype, "expiresAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_create_nested_one_without_sessions_input_1.AccountCreateNestedOneWithoutSessionsInput, { nullable: false })
], AccountSessionCreateInput.prototype, "account", void 0);
AccountSessionCreateInput = __decorate([
    (0, graphql_2.InputType)()
], AccountSessionCreateInput);
exports.AccountSessionCreateInput = AccountSessionCreateInput;
//# sourceMappingURL=account-session-create.input.js.map