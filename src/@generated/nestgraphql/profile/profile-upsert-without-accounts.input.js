"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileUpsertWithoutAccountsInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const profile_update_without_accounts_input_1 = require("./profile-update-without-accounts.input");
const class_transformer_1 = require("class-transformer");
const profile_create_without_accounts_input_1 = require("./profile-create-without-accounts.input");
const profile_where_input_1 = require("./profile-where.input");
let ProfileUpsertWithoutAccountsInput = class ProfileUpsertWithoutAccountsInput {
};
__decorate([
    (0, graphql_1.Field)(() => profile_update_without_accounts_input_1.ProfileUpdateWithoutAccountsInput, { nullable: false }),
    (0, class_transformer_1.Type)(() => profile_update_without_accounts_input_1.ProfileUpdateWithoutAccountsInput)
], ProfileUpsertWithoutAccountsInput.prototype, "update", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_create_without_accounts_input_1.ProfileCreateWithoutAccountsInput, { nullable: false }),
    (0, class_transformer_1.Type)(() => profile_create_without_accounts_input_1.ProfileCreateWithoutAccountsInput)
], ProfileUpsertWithoutAccountsInput.prototype, "create", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_where_input_1.ProfileWhereInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => profile_where_input_1.ProfileWhereInput)
], ProfileUpsertWithoutAccountsInput.prototype, "where", void 0);
ProfileUpsertWithoutAccountsInput = __decorate([
    (0, graphql_2.InputType)()
], ProfileUpsertWithoutAccountsInput);
exports.ProfileUpsertWithoutAccountsInput = ProfileUpsertWithoutAccountsInput;
//# sourceMappingURL=profile-upsert-without-accounts.input.js.map