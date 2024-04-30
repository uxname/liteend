"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountUpdateManyWithWhereWithoutProfileInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_scalar_where_input_1 = require("./account-scalar-where.input");
const class_transformer_1 = require("class-transformer");
const account_update_many_mutation_input_1 = require("./account-update-many-mutation.input");
let AccountUpdateManyWithWhereWithoutProfileInput = class AccountUpdateManyWithWhereWithoutProfileInput {
};
__decorate([
    (0, graphql_1.Field)(() => account_scalar_where_input_1.AccountScalarWhereInput, { nullable: false }),
    (0, class_transformer_1.Type)(() => account_scalar_where_input_1.AccountScalarWhereInput)
], AccountUpdateManyWithWhereWithoutProfileInput.prototype, "where", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_update_many_mutation_input_1.AccountUpdateManyMutationInput, { nullable: false }),
    (0, class_transformer_1.Type)(() => account_update_many_mutation_input_1.AccountUpdateManyMutationInput)
], AccountUpdateManyWithWhereWithoutProfileInput.prototype, "data", void 0);
AccountUpdateManyWithWhereWithoutProfileInput = __decorate([
    (0, graphql_2.InputType)()
], AccountUpdateManyWithWhereWithoutProfileInput);
exports.AccountUpdateManyWithWhereWithoutProfileInput = AccountUpdateManyWithWhereWithoutProfileInput;
//# sourceMappingURL=account-update-many-with-where-without-profile.input.js.map