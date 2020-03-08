const {gql} = require("apollo-server-express");

module.exports = gql`
    type Text {
        id: String!
        text: String!
        date: Date!
    }
`;
