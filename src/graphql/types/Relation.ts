import { gql } from 'apollo-server-koa';

export const relationTypeDef = gql`
  type Relation {
    relationId: ID!
    source: Item!
    target: Item!
  }
`;

export const relationTypeResolver = {};
