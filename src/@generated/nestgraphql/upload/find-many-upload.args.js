"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindManyUploadArgs = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const upload_where_input_1 = require("./upload-where.input");
const class_transformer_1 = require("class-transformer");
const upload_order_by_with_relation_input_1 = require("./upload-order-by-with-relation.input");
const upload_where_unique_input_1 = require("./upload-where-unique.input");
const graphql_3 = require("@nestjs/graphql");
const upload_scalar_field_enum_1 = require("./upload-scalar-field.enum");
let FindManyUploadArgs = class FindManyUploadArgs {
};
__decorate([
    (0, graphql_1.Field)(() => upload_where_input_1.UploadWhereInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => upload_where_input_1.UploadWhereInput)
], FindManyUploadArgs.prototype, "where", void 0);
__decorate([
    (0, graphql_1.Field)(() => [upload_order_by_with_relation_input_1.UploadOrderByWithRelationInput], { nullable: true })
], FindManyUploadArgs.prototype, "orderBy", void 0);
__decorate([
    (0, graphql_1.Field)(() => upload_where_unique_input_1.UploadWhereUniqueInput, { nullable: true })
], FindManyUploadArgs.prototype, "cursor", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], FindManyUploadArgs.prototype, "take", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], FindManyUploadArgs.prototype, "skip", void 0);
__decorate([
    (0, graphql_1.Field)(() => [upload_scalar_field_enum_1.UploadScalarFieldEnum], { nullable: true })
], FindManyUploadArgs.prototype, "distinct", void 0);
FindManyUploadArgs = __decorate([
    (0, graphql_2.ArgsType)()
], FindManyUploadArgs);
exports.FindManyUploadArgs = FindManyUploadArgs;
//# sourceMappingURL=find-many-upload.args.js.map