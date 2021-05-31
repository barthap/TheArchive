import { gql } from 'apollo-server-koa';

import PersonEntity from '../../data/entity/PersonEntity';
import { GraphQLContext } from '../main';

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
  { data: context }: GraphQLContext
): Promise<PersonEntity[]> => {
  return await PersonEntity.getAllAsync({ context });
};

const personById = async (
  _root: Root,
  { id }: { id: string },
  { data: context }: GraphQLContext
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
