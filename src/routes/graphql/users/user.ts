import { PrismaClient } from "@prisma/client";
import { GraphQLString, GraphQLObjectType } from "graphql";
import { PostListType } from "../posts/posts.js";
import { ProfileType } from "../profiles/profile.js";
import { UUIDType } from "../types/uuid.js";

const prisma = new PrismaClient();

const userTypeFields = {
  id: { type: UUIDType },
  name: { type: GraphQLString },
  balance: { type: GraphQLString },
  profile: {
    type: ProfileType,
    async resolve(root: { id: string }) {
      console.log('ROOT', root)
      const profile = await prisma.profile.findUnique({
        where: {
          userId: root.id
        }
      })

      console.log('profile', profile)
      return profile
    },

  },
  posts: {
    type: PostListType,
    async resolve(root: { id: string }) {
      console.log('ROOT', root)
      const post = await prisma.post.findMany({
        where: {
          authorId: root.id
        }
      })
      return post
    }
  }
};

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    ...userTypeFields,
  }),
});
