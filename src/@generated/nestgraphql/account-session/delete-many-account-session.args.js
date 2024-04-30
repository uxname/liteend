"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteManyAccountSessionArgs = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_session_where_input_1 = require("./account-session-where.input");
const class_transformer_1 = require("class-transformer");
let DeleteManyAccountSessionArgs = class DeleteManyAccountSessionArgs {
};
__decorate([
    (0, graphql_1.Field)(() => account_session_where_input_1.AccountSessionWhereInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => account_session_where_input_1.AccountSessionWhereInput)
], DeleteManyAccountSessionArgs.prototype, "where", void 0);
DeleteManyAccountSessionArgs = __decorate([
    (0, graphql_2.ArgsType)()
], DeleteManyAccountSessionArgs);
exports.DeleteManyAccountSessionArgs = DeleteManyAccountSessionArgs;
//# sourceMappingURL=delete-many-account-session.args.js.map