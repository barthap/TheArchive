import { gql } from 'apollo-server-koa';

import PersonEntity from '../../data/entity/PersonEntity';

export const itemTypeDef = gql`
  interface Item {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;

export const itemTypeResolver = {
  Item: {
    __resolveType: (parent: any) => {
      console.log('parent', parent);
      return 'Person';
    },
  },
};

export const itemCommonResolvers = {
  id: (item: PersonEntity) => item.getField('id'),
  createdAt: (item: PersonEntity) => new Date(item.getField('createdAt') ?? ''),
  updatedAt: (item: PersonEntity) => new Date(item.getField('updatedAt') ?? ''),
};
