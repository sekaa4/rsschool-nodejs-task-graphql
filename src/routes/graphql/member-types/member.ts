import { GraphQLFloat, GraphQLInt, GraphQLObjectType } from "graphql";
import { MemberIDType } from "../types/member-id.js";

const memberTypeFields = {
  // id: { type: GraphQLString },
  id: { type: MemberIDType },
  discount: { type: GraphQLFloat },
  postsLimitPerMonth: { type: GraphQLInt }
}

export const MemberType = new GraphQLObjectType({
  name: 'Member',
  fields: () => ({
    ...memberTypeFields,
  }),
})
