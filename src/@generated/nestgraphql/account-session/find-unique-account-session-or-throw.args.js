"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindUniqueAccountSessionOrThrowArgs = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const account_session_where_unique_input_1 = require("./account-session-where-unique.input");
const class_transformer_1 = require("class-transformer");
let FindUniqueAccountSessionOrThrowArgs = class FindUniqueAccountSessionOrThrowArgs {
};
__decorate([
    (0, graphql_1.Field)(() => account_session_where_unique_input_1.AccountSessionWhereUniqueInput, { nullable: false }),
    (0, class_transformer_1.Type)(() => account_session_where_unique_input_1.AccountSessionWhereUniqueInput)
], FindUniqueAccountSessionOrThrowArgs.prototype, "where", void 0);
FindUniqueAccountSessionOrThrowArgs = __decorate([
    (0, graphql_2.ArgsType)()
], FindUniqueAccountSessionOrThrowArgs);
exports.FindUniqueAccountSessionOrThrowArgs = FindUniqueAccountSessionOrThrowArgs;
//# sourceMappingURL=find-unique-account-session-or-throw.args.js.map