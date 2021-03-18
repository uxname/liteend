const {gql} = require('apollo-server-express');

module.exports = gql`
    type Post {
        id: Int!
        createdAt: Date!
        
        title: String!
        content: String
    }
`;
