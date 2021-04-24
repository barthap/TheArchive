import { gql } from 'apollo-server-koa';

import { AppContext } from '../../context';
import DocumentEntity from '../../data/entity/DocumentEntity';

export const documentQueryTypeDefs = gql`
  type DocumentQuery {
    all: [Document]!
    byId(id: ID!): Document
  }

  extend type Query {
    documents: DocumentQuery!
  }
`;

type Root = typeof undefined;

const allDocuments = async (
  _root: Root,
  _params: any,
  context: AppContext
): Promise<DocumentEntity[]> => {
  return await DocumentEntity.getAllAsync({ context });
};

const documentById = async (
  _root: Root,
  { id }: { id: string },
  context: AppContext
): Promise<DocumentEntity> => {
  const doc = await DocumentEntity.byIdAsync(id, { context });
  if (!doc) {
    throw new Error(`Document with id ${id} does not exist`);
  }
  return doc;
};

export const documentQueryResolvers = {
  Query: {
    documents: () => ({}),
  },
  DocumentQuery: {
    all: allDocuments,
    byId: documentById,
  },
};
