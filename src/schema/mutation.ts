import {gql} from 'apollo-server-express';

export default gql`
    type Mutation {
        echo(text: String!): String!
        addPost(title: String!, content: String): Boolean!
    }
`;
