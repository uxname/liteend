"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountOrderByWithRelationInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const sort_order_enum_1 = require("../prisma/sort-order.enum");
const sort_order_input_1 = require("../prisma/sort-order.input");
const account_session_order_by_relation_aggregate_input_1 = require("../account-session/account-session-order-by-relation-aggregate.input");
const profile_order_by_with_relation_input_1 = require("../profile/profile-order-by-with-relation.input");
let AccountOrderByWithRelationInput = class AccountOrderByWithRelationInput {
};
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountOrderByWithRelationInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountOrderByWithRelationInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountOrderByWithRelationInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountOrderByWithRelationInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], AccountOrderByWithRelationInput.prototype, "passwordHash", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_input_1.SortOrderInput, { nullable: true })
], AccountOrderByWithRelationInput.prototype, "profileId", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_session_order_by_relation_aggregate_input_1.AccountSessionOrderByRelationAggregateInput, { nullable: true })
], AccountOrderByWithRelationInput.prototype, "sessions", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_order_by_with_relation_input_1.ProfileOrderByWithRelationInput, { nullable: true })
], AccountOrderByWithRelationInput.prototype, "profile", void 0);
AccountOrderByWithRelationInput = __decorate([
    (0, graphql_2.InputType)()
], AccountOrderByWithRelationInput);
exports.AccountOrderByWithRelationInput = AccountOrderByWithRelationInput;
//# sourceMappingURL=account-order-by-with-relation.input.js.map