import {gql} from 'apollo-server-express';

export default gql`
    type Query {
        echo(text: String!): String! @cost(complexity: 5)
        error: Int
        getAllPosts: [Post]
    }
`;

