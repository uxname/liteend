"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Upload = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const graphql_3 = require("@nestjs/graphql");
let Upload = class Upload {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: false })
], Upload.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: false })
], Upload.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: false })
], Upload.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false })
], Upload.prototype, "filepath", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false })
], Upload.prototype, "originalFilename", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false })
], Upload.prototype, "extension", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: false })
], Upload.prototype, "size", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false })
], Upload.prototype, "mimetype", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false })
], Upload.prototype, "uploaderIp", void 0);
Upload = __decorate([
    (0, graphql_2.ObjectType)()
], Upload);
exports.Upload = Upload;
//# sourceMappingURL=upload.model.js.map