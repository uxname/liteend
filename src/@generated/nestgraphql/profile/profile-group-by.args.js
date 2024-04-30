"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileGroupByArgs = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const profile_where_input_1 = require("./profile-where.input");
const class_transformer_1 = require("class-transformer");
const profile_order_by_with_aggregation_input_1 = require("./profile-order-by-with-aggregation.input");
const profile_scalar_field_enum_1 = require("./profile-scalar-field.enum");
const profile_scalar_where_with_aggregates_input_1 = require("./profile-scalar-where-with-aggregates.input");
const graphql_3 = require("@nestjs/graphql");
const profile_count_aggregate_input_1 = require("./profile-count-aggregate.input");
const profile_avg_aggregate_input_1 = require("./profile-avg-aggregate.input");
const profile_sum_aggregate_input_1 = require("./profile-sum-aggregate.input");
const profile_min_aggregate_input_1 = require("./profile-min-aggregate.input");
const profile_max_aggregate_input_1 = require("./profile-max-aggregate.input");
let ProfileGroupByArgs = class ProfileGroupByArgs {
};
__decorate([
    (0, graphql_1.Field)(() => profile_where_input_1.ProfileWhereInput, { nullable: true }),
    (0, class_transformer_1.Type)(() => profile_where_input_1.ProfileWhereInput)
], ProfileGroupByArgs.prototype, "where", void 0);
__decorate([
    (0, graphql_1.Field)(() => [profile_order_by_with_aggregation_input_1.ProfileOrderByWithAggregationInput], { nullable: true })
], ProfileGroupByArgs.prototype, "orderBy", void 0);
__decorate([
    (0, graphql_1.Field)(() => [profile_scalar_field_enum_1.ProfileScalarFieldEnum], { nullable: false })
], ProfileGroupByArgs.prototype, "by", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_scalar_where_with_aggregates_input_1.ProfileScalarWhereWithAggregatesInput, { nullable: true })
], ProfileGroupByArgs.prototype, "having", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], ProfileGroupByArgs.prototype, "take", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_3.Int, { nullable: true })
], ProfileGroupByArgs.prototype, "skip", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_count_aggregate_input_1.ProfileCountAggregateInput, { nullable: true })
], ProfileGroupByArgs.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_avg_aggregate_input_1.ProfileAvgAggregateInput, { nullable: true })
], ProfileGroupByArgs.prototype, "_avg", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_sum_aggregate_input_1.ProfileSumAggregateInput, { nullable: true })
], ProfileGroupByArgs.prototype, "_sum", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_min_aggregate_input_1.ProfileMinAggregateInput, { nullable: true })
], ProfileGroupByArgs.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_max_aggregate_input_1.ProfileMaxAggregateInput, { nullable: true })
], ProfileGroupByArgs.prototype, "_max", void 0);
ProfileGroupByArgs = __decorate([
    (0, graphql_2.ArgsType)()
], ProfileGroupByArgs);
exports.ProfileGroupByArgs = ProfileGroupByArgs;
//# sourceMappingURL=profile-group-by.args.js.map