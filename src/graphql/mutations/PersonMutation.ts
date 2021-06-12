import { gql } from 'apollo-server-koa';

import PersonEntity from '../../data/entity/PersonEntity';
import { ID } from '../../data/types';
import { GraphQLContext } from '../main';

export const personMutationTypeDefs = gql`
  input NewPersonInput {
    fullName: String!
    birthDate: DateTime
    description: String
  }

  type PersonMutation {
    createPerson(input: NewPersonInput!): Person!
    deletePerson(personId: ID!): Person!
  }

  extend type Mutation {
    person: PersonMutation!
  }
`;

interface NewPersonInput {
  fullName: string;
  birthDate?: Date;
  description?: string;
}

export const personMutationResolvers = {
  PersonMutation: {
    createPerson: async (
      _root: unknown,
      { input }: { input: NewPersonInput },
      { data: context }: GraphQLContext
    ) => {
      return await PersonEntity.createPerson({ context, fields: input });
    },
    deletePerson: async (
      _root: unknown,
      { personId }: { personId: ID },
      { data: context }: GraphQLContext
    ) => {
      return await PersonEntity.deletePerson({ context, personId });
    },
  },
  Mutation: {
    person: () => ({}),
  },
};
