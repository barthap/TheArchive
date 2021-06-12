import { gql } from 'apollo-server-koa';

import { SingleRelation } from '../../data/repository/RelationRepository';
import { GraphQLContext } from '../main';

export const relationQueryTypeDefs = gql`
  type RelationQuery {
    byId(id: ID!): Relation!
  }

  extend type Query {
    relations: RelationQuery!
  }
`;

type Root = typeof undefined;

const relationById = async (
  _root: Root,
  { id }: { id: string },
  { data: context }: GraphQLContext
): Promise<SingleRelation> => {
  return await context.getRelationshipRepository().relationById(id);
};

export const relationQueryResolvers = {
  Query: {
    relations: () => ({}),
  },
  RelationQuery: {
    byId: relationById,
  },
};
