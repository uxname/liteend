"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSession = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const graphql_3 = require("@nestjs/graphql");
const graphql_4 = require("@nestjs/graphql");
const account_model_1 = require("../account/account.model");
let AccountSession = class AccountSession {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: false })
], AccountSession.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: false })
], AccountSession.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: false })
], AccountSession.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: false })
], AccountSession.prototype, "accountId", void 0);
__decorate([
    (0, graphql_4.HideField)()
], AccountSession.prototype, "token", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false })
], AccountSession.prototype, "ipAddr", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], AccountSession.prototype, "userAgent", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: false })
], AccountSession.prototype, "expiresAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_model_1.Account, { nullable: false })
], AccountSession.prototype, "account", void 0);
AccountSession = __decorate([
    (0, graphql_2.ObjectType)()
], AccountSession);
exports.AccountSession = AccountSession;
//# sourceMappingURL=account-session.model.js.map