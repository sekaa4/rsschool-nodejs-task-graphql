import { GraphQLScalarType, Kind } from "graphql";

export type MemberID = 'business' | 'basic'

const isMemberID = (value: unknown): value is MemberID =>
  (value === 'business' || value === 'basic');

export const MemberIDType = new GraphQLScalarType({
  name: 'MemberID',

  serialize(value) {
    if (!isMemberID(value)) {
      throw new TypeError(`Invalid MemberID.`);
    }
    return value;
  },

  parseValue(value) {
    if (!isMemberID(value)) {
      throw new TypeError(`Invalid MemberID.`);
    }
    return value;
  },

  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      if (isMemberID(ast.value)) {
        return ast.value;
      }
    }
    return undefined;
  }
})
