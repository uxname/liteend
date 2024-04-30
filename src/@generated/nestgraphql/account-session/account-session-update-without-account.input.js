"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSessionUpdateWithoutAccountInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
let AccountSessionUpdateWithoutAccountInput = class AccountSessionUpdateWithoutAccountInput {
};
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], AccountSessionUpdateWithoutAccountInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], AccountSessionUpdateWithoutAccountInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], AccountSessionUpdateWithoutAccountInput.prototype, "token", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], AccountSessionUpdateWithoutAccountInput.prototype, "ipAddr", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], AccountSessionUpdateWithoutAccountInput.prototype, "userAgent", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], AccountSessionUpdateWithoutAccountInput.prototype, "expiresAt", void 0);
AccountSessionUpdateWithoutAccountInput = __decorate([
    (0, graphql_2.InputType)()
], AccountSessionUpdateWithoutAccountInput);
exports.AccountSessionUpdateWithoutAccountInput = AccountSessionUpdateWithoutAccountInput;
//# sourceMappingURL=account-session-update-without-account.input.js.map