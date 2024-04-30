"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileUncheckedUpdateManyInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const graphql_3 = require("@nestjs/graphql");
const profile_role_enum_1 = require("../prisma/profile-role.enum");
const account_status_enum_1 = require("../prisma/account-status.enum");
let ProfileUncheckedUpdateManyInput = class ProfileUncheckedUpdateManyInput {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], ProfileUncheckedUpdateManyInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], ProfileUncheckedUpdateManyInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], ProfileUncheckedUpdateManyInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => [profile_role_enum_1.ProfileRole], { nullable: true })
], ProfileUncheckedUpdateManyInput.prototype, "roles", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_status_enum_1.AccountStatus, { nullable: true })
], ProfileUncheckedUpdateManyInput.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], ProfileUncheckedUpdateManyInput.prototype, "avatarUrl", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], ProfileUncheckedUpdateManyInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], ProfileUncheckedUpdateManyInput.prototype, "bio", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], ProfileUncheckedUpdateManyInput.prototype, "totpEnabled", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], ProfileUncheckedUpdateManyInput.prototype, "totpSecret", void 0);
ProfileUncheckedUpdateManyInput = __decorate([
    (0, graphql_2.InputType)()
], ProfileUncheckedUpdateManyInput);
exports.ProfileUncheckedUpdateManyInput = ProfileUncheckedUpdateManyInput;
//# sourceMappingURL=profile-unchecked-update-many.input.js.map