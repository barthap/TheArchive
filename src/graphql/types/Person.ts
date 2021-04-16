import { gql } from 'apollo-server-koa';

import PersonEntity from '../../data/entity/PersonEntity';

import { itemCommonResolvers } from './Item';

export const personTypeDef = gql`
  type Person implements Item {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    fullName: String!
    birthDate: DateTime
    description: String

    relatedIn: [Item]!
    relatesTo: [Item]!
  }
`;

export const personTypeResolver = {
  Person: {
    ...itemCommonResolvers,
    fullName: (person: PersonEntity) => person.getField('fullName'),
    birthDate: (person: PersonEntity) => new Date(person.getField('birthDate') ?? ''),
    description: (person: PersonEntity) => person.getField('description'),
  },
};
