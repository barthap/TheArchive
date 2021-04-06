import { gql } from 'apollo-server-koa';

import PersonEntity from '../../data/entity/PersonEntity';

export const personQueryTypeDefs = gql`
  type PersonQuery {
    all: [Person]!
    byId(id: ID!): Person
  }

  extend type Query {
    people: PersonQuery!
  }
`;

type Root = typeof undefined;

const allPeople = async (): Promise<PersonEntity[]> => {
  return await PersonEntity.getAllAsync();
};

const personById = async (_root: Root, { id }: { id: string }): Promise<PersonEntity> => {
  const person = await PersonEntity.byIdAsync(id);
  if (!person) {
    throw new Error(`Person with id ${id} does not exist`);
  }
  return person;
};

export const personQueryResolvers = {
  Query: {
    people: () => ({}),
  },
  PersonQuery: {
    all: allPeople,
    byId: personById,
  },
};
