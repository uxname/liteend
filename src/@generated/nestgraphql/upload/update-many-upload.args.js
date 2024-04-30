"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateManyUploadArgs = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const upload_update_many_mutation_input_1 = require("./upload-update-many-mutation.input");
const class_transformer_1 = require("class-transformer");
const upload_where_input_1 = require("./upload-where.input");
let UpdateManyUploadArgs = class UpdateManyUploadArgs {
};
__decorate([
    (0, graphql_1.Field)(() => upload_update_many_mutation_input_1.UploadUpdateManyMutationInput, { nullable: false }),
    (0, class_transformer_1.Type)(() => upload_update_many_mutation_input_1.UploadUpdateManyMutationInput)
], UpdateManyUploadArgs.prototype, "data", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_where_input_1.UploadWhereInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => upload_where_input_1.UploadWhereInput)
], UpdateManyUploadArgs.prototype, "where", void 0);
UpdateManyUploadArgs = __decorate([
    (0, graphql_2.ArgsType)()
], UpdateManyUploadArgs);
exports.UpdateManyUploadArgs = UpdateManyUploadArgs;
//# sourceMappingURL=update-many-upload.args.js.map