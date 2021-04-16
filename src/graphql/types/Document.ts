import { gql } from 'apollo-server-koa';

import DocumentEntity from '../../data/entity/DocumentEntity';

import { itemCommonResolvers } from './Item';

export const documentTypeDef = gql`
  type Document implements Item {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    title: String!
    type: String!
    filename: String
    content: String

    relatedIn: [Item]!
    relatesTo: [Item]!
  }
`;

export const documentTypeResolver = {
  Document: {
    ...itemCommonResolvers,
    title: (doc: DocumentEntity) => doc.getField('title'),
    type: (doc: DocumentEntity) => doc.getField('type'),
    filename: (doc: DocumentEntity) => doc.getField('filename'),
    content: (doc: DocumentEntity) => doc.getField('content'),
  },
};
