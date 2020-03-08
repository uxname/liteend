const {gql} = require("apollo-server-express");

module.exports = gql`
    type Mutation {
        echo(text: String!): String!
        addTextToDb(text: String!): Boolean!
    }
`;
