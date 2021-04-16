import { gql } from 'apollo-server-koa';

import FileEntity from '../../data/entity/FileEntity';

export const fileQueryTypeDefs = gql`
  type FileQuery {
    all: [File]!
    byId(id: ID!): File
  }

  extend type Query {
    files: FileQuery!
  }
`;

type Root = typeof undefined;

const allFiles = async (): Promise<FileEntity[]> => {
  return await FileEntity.getAllAsync();
};

const fileById = async (_root: Root, { id }: { id: string }): Promise<FileEntity> => {
  const file = await FileEntity.byIdAsync(id);
  if (!file) {
    throw new Error(`File with id ${id} does not exist`);
  }
  return file;
};

export const fileQueryResolvers = {
  Query: {
    files: () => ({}),
  },
  FileQuery: {
    all: allFiles,
    byId: fileById,
  },
};
