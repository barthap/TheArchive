import { gql } from 'apollo-server-koa';

import StoryEntity from '../../data/entity/StoryEntity';

import { itemCommonResolvers } from './Item';

export const storyTypeDef = gql`
  type Story implements Item {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    storyDateTime: DateTime!
    header: String
    content: String!

    relatedIn: [Item]!
    relatesTo: [Item]!
  }
`;

export const storyTypeResolver = {
  Story: {
    ...itemCommonResolvers,
    storyDateTime: (story: StoryEntity) => new Date(story.getField('storyDateTime') ?? ''),
    header: (story: StoryEntity) => story.getField('header'),
    content: (story: StoryEntity) => story.getField('content'),
  },
};
