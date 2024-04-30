"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSessionUpdateManyWithoutAccountNestedInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_session_create_without_account_input_1 = require("./account-session-create-without-account.input");
const class_transformer_1 = require("class-transformer");
const account_session_create_or_connect_without_account_input_1 = require("./account-session-create-or-connect-without-account.input");
const account_session_upsert_with_where_unique_without_account_input_1 = require("./account-session-upsert-with-where-unique-without-account.input");
const account_session_create_many_account_input_envelope_input_1 = require("./account-session-create-many-account-input-envelope.input");
const account_session_where_unique_input_1 = require("./account-session-where-unique.input");
const account_session_update_with_where_unique_without_account_input_1 = require("./account-session-update-with-where-unique-without-account.input");
const account_session_update_many_with_where_without_account_input_1 = require("./account-session-update-many-with-where-without-account.input");
const account_session_scalar_where_input_1 = require("./account-session-scalar-where.input");
let AccountSessionUpdateManyWithoutAccountNestedInput = class AccountSessionUpdateManyWithoutAccountNestedInput {
};
__decorate([
    (0, graphql_1.Field)(() => [account_session_create_without_account_input_1.AccountSessionCreateWithoutAccountInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_session_create_without_account_input_1.AccountSessionCreateWithoutAccountInput)
], AccountSessionUpdateManyWithoutAccountNestedInput.prototype, "create", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_session_create_or_connect_without_account_input_1.AccountSessionCreateOrConnectWithoutAccountInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_session_create_or_connect_without_account_input_1.AccountSessionCreateOrConnectWithoutAccountInput)
], AccountSessionUpdateManyWithoutAccountNestedInput.prototype, "connectOrCreate", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_session_upsert_with_where_unique_without_account_input_1.AccountSessionUpsertWithWhereUniqueWithoutAccountInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_session_upsert_with_where_unique_without_account_input_1.AccountSessionUpsertWithWhereUniqueWithoutAccountInput)
], AccountSessionUpdateManyWithoutAccountNestedInput.prototype, "upsert", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_create_many_account_input_envelope_input_1.AccountSessionCreateManyAccountInputEnvelope, { nullable: true }),
    (0, class_transformer_1.Type)(() => account_session_create_many_account_input_envelope_input_1.AccountSessionCreateManyAccountInputEnvelope)
], AccountSessionUpdateManyWithoutAccountNestedInput.prototype, "createMany", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_session_where_unique_input_1.AccountSessionWhereUniqueInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_session_where_unique_input_1.AccountSessionWhereUniqueInput)
], AccountSessionUpdateManyWithoutAccountNestedInput.prototype, "set", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_session_where_unique_input_1.AccountSessionWhereUniqueInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_session_where_unique_input_1.AccountSessionWhereUniqueInput)
], AccountSessionUpdateManyWithoutAccountNestedInput.prototype, "disconnect", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_session_where_unique_input_1.AccountSessionWhereUniqueInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_session_where_unique_input_1.AccountSessionWhereUniqueInput)
], AccountSessionUpdateManyWithoutAccountNestedInput.prototype, "delete", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_session_where_unique_input_1.AccountSessionWhereUniqueInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_session_where_unique_input_1.AccountSessionWhereUniqueInput)
], AccountSessionUpdateManyWithoutAccountNestedInput.prototype, "connect", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_session_update_with_where_unique_without_account_input_1.AccountSessionUpdateWithWhereUniqueWithoutAccountInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_session_update_with_where_unique_without_account_input_1.AccountSessionUpdateWithWhereUniqueWithoutAccountInput)
], AccountSessionUpdateManyWithoutAccountNestedInput.prototype, "update", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_session_update_many_with_where_without_account_input_1.AccountSessionUpdateManyWithWhereWithoutAccountInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_session_update_many_with_where_without_account_input_1.AccountSessionUpdateManyWithWhereWithoutAccountInput)
], AccountSessionUpdateManyWithoutAccountNestedInput.prototype, "updateMany", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_session_scalar_where_input_1.AccountSessionScalarWhereInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_session_scalar_where_input_1.AccountSessionScalarWhereInput)
], AccountSessionUpdateManyWithoutAccountNestedInput.prototype, "deleteMany", void 0);
AccountSessionUpdateManyWithoutAccountNestedInput = __decorate([
    (0, graphql_2.InputType)()
], AccountSessionUpdateManyWithoutAccountNestedInput);
exports.AccountSessionUpdateManyWithoutAccountNestedInput = AccountSessionUpdateManyWithoutAccountNestedInput;
//# sourceMappingURL=account-session-update-many-without-account-nested.input.js.map