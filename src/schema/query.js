const {gql} = require("apollo-server-express");

module.exports = gql`
    type Query {
        echo(text: String!): String! @cost(complexity: 5)
        error: Int
        getAllTexts: [Text]
    }
`;
