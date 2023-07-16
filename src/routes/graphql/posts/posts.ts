import { PrismaClient } from '@prisma/client';
import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { UserType } from '../users/users.js';

const prisma = new PrismaClient();

const postTypeFields = {
  id: { type: UUIDType },
  title: { type: GraphQLString },
  content: { type: GraphQLString },
  authorId: { type: UUIDType },
  // author: {
  //   type: UserType,
  //   async resolve(parent: { authorId: string }) {
  //     console.log('parent', parent)
  //     return await prisma.user.findUnique({
  //       where: {
  //         id: parent.authorId,
  //       },
  //     })
  //   }
  // }
};

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    ...postTypeFields,
  }),
});

export const PostTypeList = new GraphQLList(PostType);
