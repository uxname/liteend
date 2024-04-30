"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneTimeCodeMinAggregate = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const graphql_3 = require("@nestjs/graphql");
let OneTimeCodeMinAggregate = class OneTimeCodeMinAggregate {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], OneTimeCodeMinAggregate.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], OneTimeCodeMinAggregate.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], OneTimeCodeMinAggregate.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], OneTimeCodeMinAggregate.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true })
], OneTimeCodeMinAggregate.prototype, "code", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true })
], OneTimeCodeMinAggregate.prototype, "expiresAt", void 0);
OneTimeCodeMinAggregate = __decorate([
    (0, graphql_2.ObjectType)()
], OneTimeCodeMinAggregate);
exports.OneTimeCodeMinAggregate = OneTimeCodeMinAggregate;
//# sourceMappingURL=one-time-code-min-aggregate.output.js.map