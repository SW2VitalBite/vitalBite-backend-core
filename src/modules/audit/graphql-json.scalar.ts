import { GraphQLScalarType, Kind, ValueNode } from 'graphql';

function parseLiteral(ast: ValueNode): unknown {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return Number(ast.value);
    case Kind.OBJECT:
      return Object.fromEntries(
        ast.fields.map((field) => [field.name.value, parseLiteral(field.value)]),
      );
    case Kind.LIST:
      return ast.values.map((value) => parseLiteral(value));
    case Kind.NULL:
      return null;
    default:
      return undefined;
  }
}

export const GraphQLJSON = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON custom scalar',
  parseLiteral,
  parseValue: (value) => value,
  serialize: (value) => value,
});
