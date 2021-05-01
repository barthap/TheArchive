import { gql } from 'apollo-server-koa';

import { AppContext } from '../../context';
import ItemEntity from '../../data/entity/ItemEntity';

export const itemTypeDef = gql`
  interface Item {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!

    relatedIn: [Item]!
    relatesTo: [Item]!

    _referenceId: ID
  }
`;

export const itemTypeResolver = {
  Item: {
    __resolveType: (parent: ItemEntity) => {
      return parent.getTypename();
    },
  },
};

export const itemCommonResolvers = {
  id: (item: ItemEntity) => item.getField('id'),
  createdAt: (item: ItemEntity) => new Date(item.getField('createdAt') ?? ''),
  updatedAt: (item: ItemEntity) => new Date(item.getField('updatedAt') ?? ''),
  relatedIn: async (item: ItemEntity, _params: any, context: AppContext) =>
    await context.getRelationshipRepository().findItemsRelatedIn(item),
  relatesTo: async (item: ItemEntity, _params: any, context: AppContext) =>
    await context.getRelationshipRepository().findItemsRelatesTo(item),

  _referenceId: (item: ItemEntity) => item._referenceId ?? null,
};
