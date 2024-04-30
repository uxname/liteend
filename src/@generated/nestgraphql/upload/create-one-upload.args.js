"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOneUploadArgs = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const upload_create_input_1 = require("./upload-create.input");
const class_transformer_1 = require("class-transformer");
let CreateOneUploadArgs = class CreateOneUploadArgs {
};
__decorate([
    (0, graphql_1.Field)(() => upload_create_input_1.UploadCreateInput, { nullable: false }),
    (0, class_transformer_1.Type)(() => upload_create_input_1.UploadCreateInput)
], CreateOneUploadArgs.prototype, "data", void 0);
CreateOneUploadArgs = __decorate([
    (0, graphql_2.ArgsType)()
], CreateOneUploadArgs);
exports.CreateOneUploadArgs = CreateOneUploadArgs;
//# sourceMappingURL=create-one-upload.args.js.map