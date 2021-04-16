import { ApolloServer, gql } from 'apollo-server-koa';

import { documentQueryResolvers, documentQueryTypeDefs } from './queries/DocumentQuery';
import { fileQueryResolvers, fileQueryTypeDefs } from './queries/FileQuery';
import { personQueryResolvers, personQueryTypeDefs } from './queries/PersonQuery';
import { photoQueryResolvers, photoQueryTypeDefs } from './queries/PhotoQuery';
import { storyQueryResolvers, storyQueryTypeDefs } from './queries/StoryQuery';
import { customScalarDefinitions, customScalarResolvers } from './scalars';
import { documentTypeDef, documentTypeResolver } from './types/Document';
import { fileTypeDef, fileTypeResolver } from './types/File';
import { itemTypeResolver, itemTypeDef } from './types/Item';
import { personTypeDef, personTypeResolver } from './types/Person';
import { photoTypeDef, photoTypeResolver } from './types/Photo';
import { storyTypeDef, storyTypeResolver } from './types/Story';

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

const queryTypeDefs = [
  documentQueryTypeDefs,
  fileQueryTypeDefs,
  personQueryTypeDefs,
  photoQueryTypeDefs,
  storyQueryTypeDefs,
];
const queryResolvers = [
  documentQueryResolvers,
  fileQueryResolvers,
  personQueryResolvers,
  photoQueryResolvers,
  storyQueryResolvers,
];
const typeDefs = [
  documentTypeDef,
  fileTypeDef,
  itemTypeDef,
  personTypeDef,
  photoTypeDef,
  storyTypeDef,
];
const typeResolvers = [
  documentTypeResolver,
  fileTypeResolver,
  itemTypeResolver,
  personTypeResolver,
  photoTypeResolver,
  storyTypeResolver,
];

export async function startApolloServer(): Promise<ApolloServer> {
  const server = new ApolloServer({
    typeDefs: [customScalarDefinitions, rootTypeDef, ...queryTypeDefs, ...typeDefs],
    resolvers: [customScalarResolvers, rootResolver, ...queryResolvers, ...typeResolvers],
  });
  await server.start();
  return server;
}
