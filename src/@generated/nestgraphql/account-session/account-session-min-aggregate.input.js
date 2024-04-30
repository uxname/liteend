"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSessionMinAggregateInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
let AccountSessionMinAggregateInput = class AccountSessionMinAggregateInput {
};
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], AccountSessionMinAggregateInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], AccountSessionMinAggregateInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], AccountSessionMinAggregateInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], AccountSessionMinAggregateInput.prototype, "accountId", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], AccountSessionMinAggregateInput.prototype, "token", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], AccountSessionMinAggregateInput.prototype, "ipAddr", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], AccountSessionMinAggregateInput.prototype, "userAgent", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true })
], AccountSessionMinAggregateInput.prototype, "expiresAt", void 0);
AccountSessionMinAggregateInput = __decorate([
    (0, graphql_2.InputType)()
], AccountSessionMinAggregateInput);
exports.AccountSessionMinAggregateInput = AccountSessionMinAggregateInput;
//# sourceMappingURL=account-session-min-aggregate.input.js.map