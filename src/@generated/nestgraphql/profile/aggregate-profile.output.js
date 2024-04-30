"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateProfile = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const profile_count_aggregate_output_1 = require("./profile-count-aggregate.output");
const profile_avg_aggregate_output_1 = require("./profile-avg-aggregate.output");
const profile_sum_aggregate_output_1 = require("./profile-sum-aggregate.output");
const profile_min_aggregate_output_1 = require("./profile-min-aggregate.output");
const profile_max_aggregate_output_1 = require("./profile-max-aggregate.output");
let AggregateProfile = class AggregateProfile {
};
__decorate([
    (0, graphql_1.Field)(() => profile_count_aggregate_output_1.ProfileCountAggregate, { nullable: true })
], AggregateProfile.prototype, "_count", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_avg_aggregate_output_1.ProfileAvgAggregate, { nullable: true })
], AggregateProfile.prototype, "_avg", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_sum_aggregate_output_1.ProfileSumAggregate, { nullable: true })
], AggregateProfile.prototype, "_sum", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_min_aggregate_output_1.ProfileMinAggregate, { nullable: true })
], AggregateProfile.prototype, "_min", void 0);
__decorate([
    (0, graphql_1.Field)(() => profile_max_aggregate_output_1.ProfileMaxAggregate, { nullable: true })
], AggregateProfile.prototype, "_max", void 0);
AggregateProfile = __decorate([
    (0, graphql_2.ObjectType)()
], AggregateProfile);
exports.AggregateProfile = AggregateProfile;
//# sourceMappingURL=aggregate-profile.output.js.map