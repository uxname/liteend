"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileUpdateOneWithoutAccountsNestedInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const profile_create_without_accounts_input_1 = require("./profile-create-without-accounts.input");
const class_transformer_1 = require("class-transformer");
const profile_create_or_connect_without_accounts_input_1 = require("./profile-create-or-connect-without-accounts.input");
const profile_upsert_without_accounts_input_1 = require("./profile-upsert-without-accounts.input");
const profile_where_input_1 = require("./profile-where.input");
const profile_where_unique_input_1 = require("./profile-where-unique.input");
const profile_update_to_one_with_where_without_accounts_input_1 = require("./profile-update-to-one-with-where-without-accounts.input");
let ProfileUpdateOneWithoutAccountsNestedInput = class ProfileUpdateOneWithoutAccountsNestedInput {
};
__decorate([
    (0, graphql_1.Field)(() => profile_create_without_accounts_input_1.ProfileCreateWithoutAccountsInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => profile_create_without_accounts_input_1.ProfileCreateWithoutAccountsInput)
], ProfileUpdateOneWithoutAccountsNestedInput.prototype, "create", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_create_or_connect_without_accounts_input_1.ProfileCreateOrConnectWithoutAccountsInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => profile_create_or_connect_without_accounts_input_1.ProfileCreateOrConnectWithoutAccountsInput)
], ProfileUpdateOneWithoutAccountsNestedInput.prototype, "connectOrCreate", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_upsert_without_accounts_input_1.ProfileUpsertWithoutAccountsInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => profile_upsert_without_accounts_input_1.ProfileUpsertWithoutAccountsInput)
], ProfileUpdateOneWithoutAccountsNestedInput.prototype, "upsert", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_where_input_1.ProfileWhereInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => profile_where_input_1.ProfileWhereInput)
], ProfileUpdateOneWithoutAccountsNestedInput.prototype, "disconnect", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_where_input_1.ProfileWhereInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => profile_where_input_1.ProfileWhereInput)
], ProfileUpdateOneWithoutAccountsNestedInput.prototype, "delete", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_where_unique_input_1.ProfileWhereUniqueInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => profile_where_unique_input_1.ProfileWhereUniqueInput)
], ProfileUpdateOneWithoutAccountsNestedInput.prototype, "connect", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_update_to_one_with_where_without_accounts_input_1.ProfileUpdateToOneWithWhereWithoutAccountsInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => profile_update_to_one_with_where_without_accounts_input_1.ProfileUpdateToOneWithWhereWithoutAccountsInput)
], ProfileUpdateOneWithoutAccountsNestedInput.prototype, "update", void 0);
ProfileUpdateOneWithoutAccountsNestedInput = __decorate([
    (0, graphql_2.InputType)()
], ProfileUpdateOneWithoutAccountsNestedInput);
exports.ProfileUpdateOneWithoutAccountsNestedInput = ProfileUpdateOneWithoutAccountsNestedInput;
//# sourceMappingURL=profile-update-one-without-accounts-nested.input.js.map