import {gql} from 'apollo-server-express';

export default gql`
    scalar Date

    directive @cost(
        multipliers: [String],
        useMultipliers: Boolean,
        complexity: CostComplexity
    ) on OBJECT | FIELD_DEFINITION

    input CostComplexity {
        min: Int = 1,
        max: Int
    }
`;
