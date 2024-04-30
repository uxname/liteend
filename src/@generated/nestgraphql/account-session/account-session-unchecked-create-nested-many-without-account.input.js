"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSessionUncheckedCreateNestedManyWithoutAccountInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_session_create_without_account_input_1 = require("./account-session-create-without-account.input");
const class_transformer_1 = require("class-transformer");
const account_session_create_or_connect_without_account_input_1 = require("./account-session-create-or-connect-without-account.input");
const account_session_create_many_account_input_envelope_input_1 = require("./account-session-create-many-account-input-envelope.input");
const account_session_where_unique_input_1 = require("./account-session-where-unique.input");
let AccountSessionUncheckedCreateNestedManyWithoutAccountInput = class AccountSessionUncheckedCreateNestedManyWithoutAccountInput {
};
__decorate([
    (0, graphql_1.Field)(() => [account_session_create_without_account_input_1.AccountSessionCreateWithoutAccountInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_session_create_without_account_input_1.AccountSessionCreateWithoutAccountInput)
], AccountSessionUncheckedCreateNestedManyWithoutAccountInput.prototype, "create", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_session_create_or_connect_without_account_input_1.AccountSessionCreateOrConnectWithoutAccountInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_session_create_or_connect_without_account_input_1.AccountSessionCreateOrConnectWithoutAccountInput)
], AccountSessionUncheckedCreateNestedManyWithoutAccountInput.prototype, "connectOrCreate", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_create_many_account_input_envelope_input_1.AccountSessionCreateManyAccountInputEnvelope, { nullable: true }),
    (0, class_transformer_1.Type)(() => account_session_create_many_account_input_envelope_input_1.AccountSessionCreateManyAccountInputEnvelope)
], AccountSessionUncheckedCreateNestedManyWithoutAccountInput.prototype, "createMany", void 0);
__decorate([
    (0, graphql_1.Field)(() => [account_session_where_unique_input_1.AccountSessionWhereUniqueInput], { nullable: true }),
    (0, class_transformer_1.Type)(() => account_session_where_unique_input_1.AccountSessionWhereUniqueInput)
], AccountSessionUncheckedCreateNestedManyWithoutAccountInput.prototype, "connect", void 0);
AccountSessionUncheckedCreateNestedManyWithoutAccountInput = __decorate([
    (0, graphql_2.InputType)()
], AccountSessionUncheckedCreateNestedManyWithoutAccountInput);
exports.AccountSessionUncheckedCreateNestedManyWithoutAccountInput = AccountSessionUncheckedCreateNestedManyWithoutAccountInput;
//# sourceMappingURL=account-session-unchecked-create-nested-many-without-account.input.js.map