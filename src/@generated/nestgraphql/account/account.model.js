"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const graphql_3 = require("@nestjs/graphql");
const graphql_4 = require("@nestjs/graphql");
const account_session_model_1 = require("../account-session/account-session.model");
const profile_model_1 = require("../profile/profile.model");
const account_count_output_1 = require("./account-count.output");
let Account = class Account {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: false })
], Account.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: false })
], Account.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: false })
], Account.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false })
], Account.prototype, "email", void 0);
__decorate([
    (0, graphql_4.HideField)()
], Account.prototype, "passwordHash", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], Account.prototype, "profileId", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_session_model_1.AccountSession], { nullable: true })
], Account.prototype, "sessions", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_model_1.Profile, { nullable: true })
], Account.prototype, "profile", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_count_output_1.AccountCount, { nullable: false })
], Account.prototype, "_count", void 0);
Account = __decorate([
    (0, graphql_2.ObjectType)()
], Account);
exports.Account = Account;
//# sourceMappingURL=account.model.js.map