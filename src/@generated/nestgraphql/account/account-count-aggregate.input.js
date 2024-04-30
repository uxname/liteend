"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountCountAggregateInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
let AccountCountAggregateInput = class AccountCountAggregateInput {
};
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], AccountCountAggregateInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], AccountCountAggregateInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], AccountCountAggregateInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], AccountCountAggregateInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], AccountCountAggregateInput.prototype, "passwordHash", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], AccountCountAggregateInput.prototype, "profileId", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], AccountCountAggregateInput.prototype, "_all", void 0);
AccountCountAggregateInput = __decorate([
    (0, graphql_2.InputType)()
], AccountCountAggregateInput);
exports.AccountCountAggregateInput = AccountCountAggregateInput;
//# sourceMappingURL=account-count-aggregate.input.js.map