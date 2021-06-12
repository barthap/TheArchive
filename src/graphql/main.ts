import { ApolloServer, gql } from 'apollo-server-koa';

import { KoaAppContext } from '../app';
import { DataContext } from '../data/context';

import { personMutationResolvers, personMutationTypeDefs } from './mutations/PersonMutation';
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
    _unused: String @deprecated(reason: "do not use")
  }

  type Mutation {
    _unused: String @deprecated(reason: "do not use")
  }
`;

// Provide resolver functions for your schema fields
const rootResolver = {
  Query: {
    _unused: () => 'Hello world!',
  },
  Mutation: {
    _unused: () => 'Hello World',
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
const mutationTypeDefs = [personMutationTypeDefs];
const mutationResolvers = [personMutationResolvers];
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
    typeDefs: [
      customScalarDefinitions,
      rootTypeDef,
      ...queryTypeDefs,
      ...mutationTypeDefs,
      ...typeDefs,
    ],
    resolvers: [
      customScalarResolvers,
      rootResolver,
      ...queryResolvers,
      ...mutationResolvers,
      ...typeResolvers,
    ],
    context: ({ ctx }: { ctx: KoaAppContext }) => ({
      koa: ctx,
      data: ctx.state.dataManager,
    }),
  });
  await server.start();
  return server;
}

export interface GraphQLContext {
  koa: KoaAppContext;
  data: DataContext;
}
