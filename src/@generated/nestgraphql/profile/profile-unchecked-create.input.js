"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileUncheckedCreateInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const graphql_3 = require("@nestjs/graphql");
const profile_role_enum_1 = require("../prisma/profile-role.enum");
const account_status_enum_1 = require("../prisma/account-status.enum");
const account_unchecked_create_nested_many_without_profile_input_1 = require("../account/account-unchecked-create-nested-many-without-profile.input");
let ProfileUncheckedCreateInput = class ProfileUncheckedCreateInput {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], ProfileUncheckedCreateInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], ProfileUncheckedCreateInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], ProfileUncheckedCreateInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => [profile_role_enum_1.ProfileRole], { nullable: true })
], ProfileUncheckedCreateInput.prototype, "roles", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_status_enum_1.AccountStatus, { nullable: false })
], ProfileUncheckedCreateInput.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], ProfileUncheckedCreateInput.prototype, "avatarUrl", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], ProfileUncheckedCreateInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], ProfileUncheckedCreateInput.prototype, "bio", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], ProfileUncheckedCreateInput.prototype, "totpEnabled", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], ProfileUncheckedCreateInput.prototype, "totpSecret", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_unchecked_create_nested_many_without_profile_input_1.AccountUncheckedCreateNestedManyWithoutProfileInput, { nullable: true })
], ProfileUncheckedCreateInput.prototype, "accounts", void 0);
ProfileUncheckedCreateInput = __decorate([
    (0, graphql_2.InputType)()
], ProfileUncheckedCreateInput);
exports.ProfileUncheckedCreateInput = ProfileUncheckedCreateInput;
//# sourceMappingURL=profile-unchecked-create.input.js.map