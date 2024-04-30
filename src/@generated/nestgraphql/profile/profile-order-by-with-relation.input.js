"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileOrderByWithRelationInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const sort_order_enum_1 = require("../prisma/sort-order.enum");
const sort_order_input_1 = require("../prisma/sort-order.input");
const account_order_by_relation_aggregate_input_1 = require("../account/account-order-by-relation-aggregate.input");
let ProfileOrderByWithRelationInput = class ProfileOrderByWithRelationInput {
};
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], ProfileOrderByWithRelationInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], ProfileOrderByWithRelationInput.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], ProfileOrderByWithRelationInput.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], ProfileOrderByWithRelationInput.prototype, "roles", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], ProfileOrderByWithRelationInput.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_input_1.SortOrderInput, { nullable: true })
], ProfileOrderByWithRelationInput.prototype, "avatarUrl", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_input_1.SortOrderInput, { nullable: true })
], ProfileOrderByWithRelationInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_input_1.SortOrderInput, { nullable: true })
], ProfileOrderByWithRelationInput.prototype, "bio", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: true })
], ProfileOrderByWithRelationInput.prototype, "totpEnabled", void 0);
__decorate([
    (0, graphql_1.Field)(() => sort_order_input_1.SortOrderInput, { nullable: true })
], ProfileOrderByWithRelationInput.prototype, "totpSecret", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_order_by_relation_aggregate_input_1.AccountOrderByRelationAggregateInput, { nullable: true })
], ProfileOrderByWithRelationInput.prototype, "accounts", void 0);
ProfileOrderByWithRelationInput = __decorate([
    (0, graphql_2.InputType)()
], ProfileOrderByWithRelationInput);
exports.ProfileOrderByWithRelationInput = ProfileOrderByWithRelationInput;
//# sourceMappingURL=profile-order-by-with-relation.input.js.map