import { gql } from 'apollo-server-koa';

import { ID } from '../../data/types';
import { GraphQLContext } from '../main';

export const relationMutationTypeDefs = gql`
  input NewRelationInput {
    sourceId: ID!
    targetId: ID!
  }

  type RelationMutation {
    createRelation(input: NewRelationInput!): Relation!
    deleteRelation(relationId: ID!): Relation!
  }

  extend type Mutation {
    relations: RelationMutation!
  }
`;

interface NewRelationInput {
  sourceId: ID;
  targetId: ID;
}

export const relationMutationResolvers = {
  RelationMutation: {
    createRelation: async (
      _root: unknown,
      { input }: { input: NewRelationInput },
      { data: context }: GraphQLContext
    ) => {
      const { sourceId, targetId } = input;
      return await context.getRelationshipRepository().createRelation(sourceId, targetId);
    },
    deleteRelation: async (
      _root: unknown,
      { relationId }: { relationId: ID },
      { data: context }: GraphQLContext
    ) => {
      return await context.getRelationshipRepository().deleteRelation(relationId);
    },
  },
  Mutation: {
    relations: () => ({}),
  },
};
