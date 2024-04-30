"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileAggregateArgs = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const profile_where_input_1 = require("./profile-where.input");
const class_transformer_1 = require("class-transformer");
const profile_order_by_with_relation_input_1 = require("./profile-order-by-with-relation.input");
const profile_where_unique_input_1 = require("./profile-where-unique.input");
const graphql_3 = require("@nestjs/graphql");
const profile_count_aggregate_input_1 = require("./profile-count-aggregate.input");
const profile_avg_aggregate_input_1 = require("./profile-avg-aggregate.input");
const profile_sum_aggregate_input_1 = require("./profile-sum-aggregate.input");
const profile_min_aggregate_input_1 = require("./profile-min-aggregate.input");
const profile_max_aggregate_input_1 = require("./profile-max-aggregate.input");
let ProfileAggregateArgs = class ProfileAggregateArgs {
};
__decorate([
    (0, graphql_1.Field)(() => profile_where_input_1.ProfileWhereInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => profile_where_input_1.ProfileWhereInput)
], ProfileAggregateArgs.prototype, "where", void 0);
__decorate([
    (0, graphql_1.Field)(() => [profile_order_by_with_relation_input_1.ProfileOrderByWithRelationInput], { nullable: true })
], ProfileAggregateArgs.prototype, "orderBy", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_where_unique_input_1.ProfileWhereUniqueInput, { nullable: true })
], ProfileAggregateArgs.prototype, "cursor", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], ProfileAggregateArgs.prototype, "take", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], ProfileAggregateArgs.prototype, "skip", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_count_aggregate_input_1.ProfileCountAggregateInput, { nullable: true })
], ProfileAggregateArgs.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_avg_aggregate_input_1.ProfileAvgAggregateInput, { nullable: true })
], ProfileAggregateArgs.prototype, "_avg", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_sum_aggregate_input_1.ProfileSumAggregateInput, { nullable: true })
], ProfileAggregateArgs.prototype, "_sum", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_min_aggregate_input_1.ProfileMinAggregateInput, { nullable: true })
], ProfileAggregateArgs.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_max_aggregate_input_1.ProfileMaxAggregateInput, { nullable: true })
], ProfileAggregateArgs.prototype, "_max", void 0);
ProfileAggregateArgs = __decorate([
    (0, graphql_2.ArgsType)()
], ProfileAggregateArgs);
exports.ProfileAggregateArgs = ProfileAggregateArgs;
//# sourceMappingURL=profile-aggregate.args.js.map