const {gql} = require('apollo-server-express');

module.exports = gql`
    type Mutation {
        echo(text: String!): String!
        addPost(title: String!, content: String): Boolean!
    }
`;
