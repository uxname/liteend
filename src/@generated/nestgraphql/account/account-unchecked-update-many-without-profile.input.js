"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountUncheckedUpdateManyWithoutProfileInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const graphql_3 = require("@nestjs/graphql");
let AccountUncheckedUpdateManyWithoutProfileInput = class AccountUncheckedUpdateManyWithoutProfileInput {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], AccountUncheckedUpdateManyWithoutProfileInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], AccountUncheckedUpdateManyWithoutProfileInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], AccountUncheckedUpdateManyWithoutProfileInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], AccountUncheckedUpdateManyWithoutProfileInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], AccountUncheckedUpdateManyWithoutProfileInput.prototype, "passwordHash", void 0);
AccountUncheckedUpdateManyWithoutProfileInput = __decorate([
    (0, graphql_2.InputType)()
], AccountUncheckedUpdateManyWithoutProfileInput);
exports.AccountUncheckedUpdateManyWithoutProfileInput = AccountUncheckedUpdateManyWithoutProfileInput;
//# sourceMappingURL=account-unchecked-update-many-without-profile.input.js.map