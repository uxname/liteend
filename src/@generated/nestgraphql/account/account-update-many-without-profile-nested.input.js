"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountUpdateManyWithoutProfileNestedInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_create_without_profile_input_1 = require("./account-create-without-profile.input");
const class_transformer_1 = require("class-transformer");
const account_create_or_connect_without_profile_input_1 = require("./account-create-or-connect-without-profile.input");
const account_upsert_with_where_unique_without_profile_input_1 = require("./account-upsert-with-where-unique-without-profile.input");
const account_create_many_profile_input_envelope_input_1 = require("./account-create-many-profile-input-envelope.input");
const account_where_unique_input_1 = require("./account-where-unique.input");
const account_update_with_where_unique_without_profile_input_1 = require("./account-update-with-where-unique-without-profile.input");
const account_update_many_with_where_without_profile_input_1 = require("./account-update-many-with-where-without-profile.input");
const account_scalar_where_input_1 = require("./account-scalar-where.input");
let AccountUpdateManyWithoutProfileNestedInput = class AccountUpdateManyWithoutProfileNestedInput {
};
__decorate([
    (0, graphql_1.Field)(() => [account_create_without_profile_input_1.AccountCreateWithoutProfileInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_create_without_profile_input_1.AccountCreateWithoutProfileInput)
], AccountUpdateManyWithoutProfileNestedInput.prototype, "create", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_create_or_connect_without_profile_input_1.AccountCreateOrConnectWithoutProfileInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_create_or_connect_without_profile_input_1.AccountCreateOrConnectWithoutProfileInput)
], AccountUpdateManyWithoutProfileNestedInput.prototype, "connectOrCreate", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_upsert_with_where_unique_without_profile_input_1.AccountUpsertWithWhereUniqueWithoutProfileInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_upsert_with_where_unique_without_profile_input_1.AccountUpsertWithWhereUniqueWithoutProfileInput)
], AccountUpdateManyWithoutProfileNestedInput.prototype, "upsert", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_create_many_profile_input_envelope_input_1.AccountCreateManyProfileInputEnvelope, { nullable: true }),
    (0, class_transformer_1.Type)(() => account_create_many_profile_input_envelope_input_1.AccountCreateManyProfileInputEnvelope)
], AccountUpdateManyWithoutProfileNestedInput.prototype, "createMany", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_where_unique_input_1.AccountWhereUniqueInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_where_unique_input_1.AccountWhereUniqueInput)
], AccountUpdateManyWithoutProfileNestedInput.prototype, "set", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_where_unique_input_1.AccountWhereUniqueInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_where_unique_input_1.AccountWhereUniqueInput)
], AccountUpdateManyWithoutProfileNestedInput.prototype, "disconnect", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_where_unique_input_1.AccountWhereUniqueInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_where_unique_input_1.AccountWhereUniqueInput)
], AccountUpdateManyWithoutProfileNestedInput.prototype, "delete", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_where_unique_input_1.AccountWhereUniqueInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_where_unique_input_1.AccountWhereUniqueInput)
], AccountUpdateManyWithoutProfileNestedInput.prototype, "connect", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_update_with_where_unique_without_profile_input_1.AccountUpdateWithWhereUniqueWithoutProfileInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_update_with_where_unique_without_profile_input_1.AccountUpdateWithWhereUniqueWithoutProfileInput)
], AccountUpdateManyWithoutProfileNestedInput.prototype, "update", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_update_many_with_where_without_profile_input_1.AccountUpdateManyWithWhereWithoutProfileInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_update_many_with_where_without_profile_input_1.AccountUpdateManyWithWhereWithoutProfileInput)
], AccountUpdateManyWithoutProfileNestedInput.prototype, "updateMany", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_scalar_where_input_1.AccountScalarWhereInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_scalar_where_input_1.AccountScalarWhereInput)
], AccountUpdateManyWithoutProfileNestedInput.prototype, "deleteMany", void 0);
AccountUpdateManyWithoutProfileNestedInput = __decorate([
    (0, graphql_2.InputType)()
], AccountUpdateManyWithoutProfileNestedInput);
exports.AccountUpdateManyWithoutProfileNestedInput = AccountUpdateManyWithoutProfileNestedInput;
//# sourceMappingURL=account-update-many-without-profile-nested.input.js.map