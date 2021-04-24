import { gql } from 'apollo-server-koa';

import { AppContext } from '../../context';
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

const allFiles = async (_root: Root, _params: any, context: AppContext): Promise<FileEntity[]> => {
  return await FileEntity.getAllAsync({ context });
};

const fileById = async (
  _root: Root,
  { id }: { id: string },
  context: AppContext
): Promise<FileEntity> => {
  const file = await FileEntity.byIdAsync(id, { context });
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
