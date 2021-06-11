import { gql } from 'apollo-server-koa';

import FileEntity from '../../data/entity/FileEntity';
import { GraphQLContext } from '../main';

import { ItemQueryParams } from './common';

export const fileQueryTypeDefs = gql`
  type FileQuery {
    all(limit: Int, offset: Int): [File]!
    byId(id: ID!): File
  }

  extend type Query {
    files: FileQuery!
  }
`;

type Root = typeof undefined;

const allFiles = async (
  _root: Root,
  params: ItemQueryParams,
  { data: context }: GraphQLContext
): Promise<FileEntity[]> => {
  return await FileEntity.getAllAsync({ context, ...params });
};

const fileById = async (
  _root: Root,
  { id }: { id: string },
  { data: context }: GraphQLContext
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
