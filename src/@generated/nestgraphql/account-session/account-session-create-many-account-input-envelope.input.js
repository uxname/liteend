"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSessionCreateManyAccountInputEnvelope = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_session_create_many_account_input_1 = require("./account-session-create-many-account.input");
const class_transformer_1 = require("class-transformer");
let AccountSessionCreateManyAccountInputEnvelope = class AccountSessionCreateManyAccountInputEnvelope {
};
__decorate([
    (0, graphql_1.Field)(() => [account_session_create_many_account_input_1.AccountSessionCreateManyAccountInput], { nullable: false }),
    (0, class_transformer_1.Type)(() => account_session_create_many_account_input_1.AccountSessionCreateManyAccountInput)
], AccountSessionCreateManyAccountInputEnvelope.prototype, "data", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], AccountSessionCreateManyAccountInputEnvelope.prototype, "skipDuplicates", void 0);
AccountSessionCreateManyAccountInputEnvelope = __decorate([
    (0, graphql_2.InputType)()
], AccountSessionCreateManyAccountInputEnvelope);
exports.AccountSessionCreateManyAccountInputEnvelope = AccountSessionCreateManyAccountInputEnvelope;
//# sourceMappingURL=account-session-create-many-account-input-envelope.input.js.map