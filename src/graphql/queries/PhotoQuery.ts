import { gql } from 'apollo-server-koa';

import PhotoEntity from '../../data/entity/PhotoEntity';
import { GraphQLContext } from '../main';

import { ItemQueryParams } from './common';

export const photoQueryTypeDefs = gql`
  type PhotoQuery {
    all(limit: Int, offset: Int): [Photo]!
    byId(id: ID!): Photo
  }

  extend type Query {
    photos: PhotoQuery!
  }
`;

type Root = typeof undefined;

const allPhotos = async (
  _root: Root,
  params: ItemQueryParams,
  { data: context }: GraphQLContext
): Promise<PhotoEntity[]> => {
  return await PhotoEntity.getAllAsync({ context, ...params });
};

const photoById = async (
  _root: Root,
  { id }: { id: string },
  { data: context }: GraphQLContext
): Promise<PhotoEntity> => {
  const photo = await PhotoEntity.byIdAsync(id, { context });
  if (!photo) {
    throw new Error(`Photo with id ${id} does not exist`);
  }
  return photo;
};

export const photoQueryResolvers = {
  Query: {
    photos: () => ({}),
  },
  PhotoQuery: {
    all: allPhotos,
    byId: photoById,
  },
};
