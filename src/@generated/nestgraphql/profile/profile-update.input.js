"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileUpdateInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const profile_role_enum_1 = require("../prisma/profile-role.enum");
const account_status_enum_1 = require("../prisma/account-status.enum");
const account_update_many_without_profile_nested_input_1 = require("../account/account-update-many-without-profile-nested.input");
let ProfileUpdateInput = class ProfileUpdateInput {
};
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], ProfileUpdateInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], ProfileUpdateInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => [profile_role_enum_1.ProfileRole], { nullable: true })
], ProfileUpdateInput.prototype, "roles", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_status_enum_1.AccountStatus, { nullable: true })
], ProfileUpdateInput.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], ProfileUpdateInput.prototype, "avatarUrl", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], ProfileUpdateInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], ProfileUpdateInput.prototype, "bio", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], ProfileUpdateInput.prototype, "totpEnabled", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], ProfileUpdateInput.prototype, "totpSecret", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_update_many_without_profile_nested_input_1.AccountUpdateManyWithoutProfileNestedInput, { nullable: true })
], ProfileUpdateInput.prototype, "accounts", void 0);
ProfileUpdateInput = __decorate([
    (0, graphql_2.InputType)()
], ProfileUpdateInput);
exports.ProfileUpdateInput = ProfileUpdateInput;
//# sourceMappingURL=profile-update.input.js.map