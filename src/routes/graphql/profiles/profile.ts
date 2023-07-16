import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from "graphql";
import { MemberIDType } from "../types/member-id.js";
import { UUIDType } from "../types/uuid.js";

const profileTypeFields = {
  id: { type: UUIDType },
  isMale: { type: GraphQLBoolean },
  yearOfBirth: { type: GraphQLInt },
  userId: { type: UUIDType },
  memberTypeId: { type: MemberIDType }
}

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    ...profileTypeFields
  })
}
)
