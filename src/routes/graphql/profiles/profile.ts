import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from 'graphql';
import { MemberType } from '../member-types/member.js';
import { Context } from '../types/ctx.type.js';
import { MemberTypeId } from '../types/member-id-enum.js';
import { UUIDType } from '../types/uuid.js';

const profileTypeFields = {
  id: { type: UUIDType },
  isMale: { type: GraphQLBoolean },
  yearOfBirth: { type: GraphQLInt },
  userId: { type: UUIDType },
  memberTypeId: { type: MemberTypeId },
  memberType: {
    type: MemberType,
    async resolve(root: { memberTypeId: string }, args, ctx: Context) {
      const { prisma } = ctx;

      const memberType = await prisma.memberType.findUnique({
        where: {
          id: root.memberTypeId,
        },
      });
      return memberType;
    },
  },
};

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    ...profileTypeFields,
  }),
});
