"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSessionOrderByWithRelationInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const sort_order_enum_1 = require("../prisma/sort-order.enum");
const sort_order_input_1 = require("../prisma/sort-order.input");
const account_order_by_with_relation_input_1 = require("../account/account-order-by-with-relation.input");
let AccountSessionOrderByWithRelationInput = class AccountSessionOrderByWithRelationInput {
};
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountSessionOrderByWithRelationInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountSessionOrderByWithRelationInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountSessionOrderByWithRelationInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountSessionOrderByWithRelationInput.prototype, "accountId", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountSessionOrderByWithRelationInput.prototype, "token", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountSessionOrderByWithRelationInput.prototype, "ipAddr", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_input_1.SortOrderInput, { nullable: true })
], AccountSessionOrderByWithRelationInput.prototype, "userAgent", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountSessionOrderByWithRelationInput.prototype, "expiresAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_order_by_with_relation_input_1.AccountOrderByWithRelationInput, { nullable: true })
], AccountSessionOrderByWithRelationInput.prototype, "account", void 0);
AccountSessionOrderByWithRelationInput = __decorate([
    (0, graphql_2.InputType)()
], AccountSessionOrderByWithRelationInput);
exports.AccountSessionOrderByWithRelationInput = AccountSessionOrderByWithRelationInput;
//# sourceMappingURL=account-session-order-by-with-relation.input.js.map