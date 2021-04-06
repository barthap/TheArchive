import { ApolloServer, gql } from 'apollo-server-koa';

import { personQueryResolvers, personQueryTypeDefs } from './queries/PersonQuery';
import { customScalarDefinitions, customScalarResolvers } from './scalars';
import { itemTypeResolver, itemTypeDef } from './types/Item';
import { personTypeDef, personTypeResolver } from './types/Person';

// Construct a schema, using GraphQL schema language
const rootTypeDef = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const rootResolver = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const queryTypeDefs = [personQueryTypeDefs];
const queryResolvers = [personQueryResolvers];
const typeDefs = [itemTypeDef, personTypeDef];
const typeResolvers = [itemTypeResolver, personTypeResolver];

export async function startApolloServer(): Promise<ApolloServer> {
  const server = new ApolloServer({
    typeDefs: [customScalarDefinitions, rootTypeDef, ...queryTypeDefs, ...typeDefs],
    resolvers: [customScalarResolvers, rootResolver, ...queryResolvers, ...typeResolvers],
  });
  await server.start();
  return server;
}
