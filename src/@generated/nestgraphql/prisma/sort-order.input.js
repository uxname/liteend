"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortOrderInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const sort_order_enum_1 = require("./sort-order.enum");
const nulls_order_enum_1 = require("./nulls-order.enum");
let SortOrderInput = class SortOrderInput {
};
__decorate([
    (0, graphql_1.Field)(() => sort_order_enum_1.SortOrder, { nullable: false })
], SortOrderInput.prototype, "sort", void 0);
__decorate([
    (0, graphql_1.Field)(() => nulls_order_enum_1.NullsOrder, { nullable: true })
], SortOrderInput.prototype, "nulls", void 0);
SortOrderInput = __decorate([
    (0, graphql_2.InputType)()
], SortOrderInput);
exports.SortOrderInput = SortOrderInput;
//# sourceMappingURL=sort-order.input.js.map