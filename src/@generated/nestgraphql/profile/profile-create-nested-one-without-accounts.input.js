"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileCreateNestedOneWithoutAccountsInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const profile_create_without_accounts_input_1 = require("./profile-create-without-accounts.input");
const class_transformer_1 = require("class-transformer");
const profile_create_or_connect_without_accounts_input_1 = require("./profile-create-or-connect-without-accounts.input");
const profile_where_unique_input_1 = require("./profile-where-unique.input");
let ProfileCreateNestedOneWithoutAccountsInput = class ProfileCreateNestedOneWithoutAccountsInput {
};
__decorate([
    (0, graphql_1.Field)(() => profile_create_without_accounts_input_1.ProfileCreateWithoutAccountsInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => profile_create_without_accounts_input_1.ProfileCreateWithoutAccountsInput)
], ProfileCreateNestedOneWithoutAccountsInput.prototype, "create", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_create_or_connect_without_accounts_input_1.ProfileCreateOrConnectWithoutAccountsInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => profile_create_or_connect_without_accounts_input_1.ProfileCreateOrConnectWithoutAccountsInput)
], ProfileCreateNestedOneWithoutAccountsInput.prototype, "connectOrCreate", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_where_unique_input_1.ProfileWhereUniqueInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => profile_where_unique_input_1.ProfileWhereUniqueInput)
], ProfileCreateNestedOneWithoutAccountsInput.prototype, "connect", void 0);
ProfileCreateNestedOneWithoutAccountsInput = __decorate([
    (0, graphql_2.InputType)()
], ProfileCreateNestedOneWithoutAccountsInput);
exports.ProfileCreateNestedOneWithoutAccountsInput = ProfileCreateNestedOneWithoutAccountsInput;
//# sourceMappingURL=profile-create-nested-one-without-accounts.input.js.map