"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileUncheckedCreateWithoutAccountsInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const graphql_3 = require("@nestjs/graphql");
const profile_role_enum_1 = require("../prisma/profile-role.enum");
const account_status_enum_1 = require("../prisma/account-status.enum");
let ProfileUncheckedCreateWithoutAccountsInput = class ProfileUncheckedCreateWithoutAccountsInput {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], ProfileUncheckedCreateWithoutAccountsInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], ProfileUncheckedCreateWithoutAccountsInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], ProfileUncheckedCreateWithoutAccountsInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => [profile_role_enum_1.ProfileRole], { nullable: true })
], ProfileUncheckedCreateWithoutAccountsInput.prototype, "roles", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_status_enum_1.AccountStatus, { nullable: false })
], ProfileUncheckedCreateWithoutAccountsInput.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], ProfileUncheckedCreateWithoutAccountsInput.prototype, "avatarUrl", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], ProfileUncheckedCreateWithoutAccountsInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], ProfileUncheckedCreateWithoutAccountsInput.prototype, "bio", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], ProfileUncheckedCreateWithoutAccountsInput.prototype, "totpEnabled", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], ProfileUncheckedCreateWithoutAccountsInput.prototype, "totpSecret", void 0);
ProfileUncheckedCreateWithoutAccountsInput = __decorate([
    (0, graphql_2.InputType)()
], ProfileUncheckedCreateWithoutAccountsInput);
exports.ProfileUncheckedCreateWithoutAccountsInput = ProfileUncheckedCreateWithoutAccountsInput;
//# sourceMappingURL=profile-unchecked-create-without-accounts.input.js.map