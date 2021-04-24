import { gql } from 'apollo-server-koa';

import { AppContext } from '../../context';
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

const allPeople = async (
  _root: Root,
  _params: any,
  context: AppContext
): Promise<PersonEntity[]> => {
  return await PersonEntity.getAllAsync({ context });
};

const personById = async (
  _root: Root,
  { id }: { id: string },
  context: AppContext
): Promise<PersonEntity> => {
  const person = await PersonEntity.byIdAsync(id, { context });
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
