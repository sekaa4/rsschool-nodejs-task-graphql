import { PrismaClient } from "@prisma/client";
import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from "graphql";
import { MemberType } from "../member-types/member.js";
import { MemberTypeId } from "../types/member-id.js";
import { UUIDType } from "../types/uuid.js";

const prisma = new PrismaClient();

const profileTypeFields = {
  id: { type: UUIDType },
  isMale: { type: GraphQLBoolean },
  yearOfBirth: { type: GraphQLInt },
  userId: { type: UUIDType },
  memberTypeId: { type: MemberTypeId },
  memberType: {
    type: MemberType,
    async resolve(root: { memberTypeId: string }) {
      const memberType = await prisma.memberType.findUnique({
        where: {
          id: root.memberTypeId
        }
      })
      return memberType
    }
  }
}

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    ...profileTypeFields
  })
}
)
