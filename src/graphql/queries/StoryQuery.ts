import { gql } from 'apollo-server-koa';

import StoryEntity from '../../data/entity/StoryEntity';
import { GraphQLContext } from '../main';

import { ItemQueryParams } from './common';

export const storyQueryTypeDefs = gql`
  type StoryQuery {
    all(limit: Int, offset: Int): [Story]!
    byId(id: ID!): Story
  }

  extend type Query {
    story: StoryQuery!
  }
`;

type Root = typeof undefined;

const allStories = async (
  _root: Root,
  params: ItemQueryParams,
  { data: context }: GraphQLContext
): Promise<StoryEntity[]> => {
  return await StoryEntity.getAllAsync({ context, ...params });
};

const storyById = async (
  _root: Root,
  { id }: { id: string },
  { data: context }: GraphQLContext
): Promise<StoryEntity> => {
  const story = await StoryEntity.byIdAsync(id, { context });
  if (!story) {
    throw new Error(`Story with id ${id} does not exist`);
  }
  return story;
};

export const storyQueryResolvers = {
  Query: {
    story: () => ({}),
  },
  StoryQuery: {
    all: allStories,
    byId: storyById,
  },
};
