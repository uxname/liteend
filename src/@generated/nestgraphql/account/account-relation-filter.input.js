"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRelationFilter = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_where_input_1 = require("./account-where.input");
let AccountRelationFilter = class AccountRelationFilter {
};
__decorate([
    (0, graphql_1.Field)(() => account_where_input_1.AccountWhereInput, { nullable: true })
], AccountRelationFilter.prototype, "is", void 0);
__decorate([
    (0, graphql_1.Field)(() => account_where_input_1.AccountWhereInput, { nullable: true })
], AccountRelationFilter.prototype, "isNot", void 0);
AccountRelationFilter = __decorate([
    (0, graphql_2.InputType)()
], AccountRelationFilter);
exports.AccountRelationFilter = AccountRelationFilter;
//# sourceMappingURL=account-relation-filter.input.js.map