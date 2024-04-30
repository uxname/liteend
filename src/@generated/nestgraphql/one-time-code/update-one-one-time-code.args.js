"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOneOneTimeCodeArgs = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const one_time_code_update_input_1 = require("./one-time-code-update.input");
const class_transformer_1 = require("class-transformer");
const one_time_code_where_unique_input_1 = require("./one-time-code-where-unique.input");
let UpdateOneOneTimeCodeArgs = class UpdateOneOneTimeCodeArgs {
};
__decorate([
    (0, graphql_1.Field)(() => one_time_code_update_input_1.OneTimeCodeUpdateInput, { nullable: false }),
    (0, class_transformer_1.Type)(() => one_time_code_update_input_1.OneTimeCodeUpdateInput)
], UpdateOneOneTimeCodeArgs.prototype, "data", void 0);
__decorate([
    (0, graphql_1.Field)(() => one_time_code_where_unique_input_1.OneTimeCodeWhereUniqueInput, { nullable: false }),
    (0, class_transformer_1.Type)(() => one_time_code_where_unique_input_1.OneTimeCodeWhereUniqueInput)
], UpdateOneOneTimeCodeArgs.prototype, "where", void 0);
UpdateOneOneTimeCodeArgs = __decorate([
    (0, graphql_2.ArgsType)()
], UpdateOneOneTimeCodeArgs);
exports.UpdateOneOneTimeCodeArgs = UpdateOneOneTimeCodeArgs;
//# sourceMappingURL=update-one-one-time-code.args.js.map