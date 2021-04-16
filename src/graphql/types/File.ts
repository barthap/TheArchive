import { gql } from 'apollo-server-koa';

import FileEntity from '../../data/entity/FileEntity';

import { itemCommonResolvers } from './Item';

export const fileTypeDef = gql`
  type File implements Item {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    filename: String!
    title: String!
    description: String
  }
`;

export const fileTypeResolver = {
  File: {
    ...itemCommonResolvers,
    filename: (file: FileEntity) => file.getField('filename'),
    title: (file: FileEntity) => file.getField('title'),
    description: (file: FileEntity) => file.getField('description'),
  },
};
