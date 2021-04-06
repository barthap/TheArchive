import { gql } from 'apollo-server-koa';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

function invariant(cond: boolean, message: string): void | never {
  if (!cond) {
    throw new Error(message);
  }
}

export const customScalarDefinitions = gql`
  scalar DateTime
`;

export const customScalarResolvers = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'Date custom scalar type',
    parseValue(value: any) {
      const dateStr: string = value;
      return new Date(dateStr); // value from the client
    },
    serialize(value: any) {
      const date: Date = value;
      return date.toJSON(); // value sent to the client
    },
    parseLiteral(ast: any) {
      invariant(
        ast.kind === Kind.STRING,
        `Query error: Can only parse strings to dates but got a: ${ast.kind}`
      );
      const result = new Date(ast.value);
      invariant(!isNaN(result.getTime()), 'Query error: Invalid date');
      invariant(
        ast.value === result.toJSON(),
        'Query error: Invalid date format, only accepts: YYYY-MM-DDTHH:MM:SS.SSSZ'
      );
      return result;
    },
  }),
};
