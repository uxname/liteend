"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const graphql_3 = require("@nestjs/graphql");
const profile_role_enum_1 = require("../prisma/profile-role.enum");
const account_status_enum_1 = require("../prisma/account-status.enum");
const graphql_4 = require("@nestjs/graphql");
const account_model_1 = require("../account/account.model");
const profile_count_output_1 = require("./profile-count.output");
let Profile = class Profile {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: false })
], Profile.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: false })
], Profile.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: false })
], Profile.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => [profile_role_enum_1.ProfileRole], { nullable: true })
], Profile.prototype, "roles", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_status_enum_1.AccountStatus, { nullable: false })
], Profile.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], Profile.prototype, "avatarUrl", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], Profile.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], Profile.prototype, "bio", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: false, defaultValue: false })
], Profile.prototype, "totpEnabled", void 0);
__decorate([
    (0, graphql_4.HideField)()
], Profile.prototype, "totpSecret", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_model_1.Account], { nullable: true })
], Profile.prototype, "accounts", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_count_output_1.ProfileCount, { nullable: false })
], Profile.prototype, "_count", void 0);
Profile = __decorate([
    (0, graphql_2.ObjectType)()
], Profile);
exports.Profile = Profile;
//# sourceMappingURL=profile.model.js.map