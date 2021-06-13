import { gql } from 'apollo-server-koa';

export const relationTypeDef = gql`
  """
  Represents a relation between two items
  """
  type Relation {
    relationId: ID!
    source: Item!
    target: Item!
  }
`;

export const relationTypeResolver = {};
