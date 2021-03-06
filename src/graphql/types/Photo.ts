import { gql } from 'apollo-server-koa';

import PhotoEntity from '../../data/entity/PhotoEntity';

import { itemCommonResolvers } from './Item';

export const photoTypeDef = gql`
  type Photo implements Item {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    filename: String!
    title: String!
    description: String

    relatedIn: [Item]!
    relatesTo: [Item]!

    _referenceId: ID
  }
`;

export const photoTypeResolver = {
  Photo: {
    ...itemCommonResolvers,
    filename: (photo: PhotoEntity) => photo.getField('filename'),
    title: (photo: PhotoEntity) => photo.getField('title'),
    description: (photo: PhotoEntity) => photo.getField('description'),
  },
};
