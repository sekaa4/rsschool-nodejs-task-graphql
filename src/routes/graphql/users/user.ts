import { GraphQLString, GraphQLObjectType, GraphQLList } from 'graphql';
import { PostListType } from '../posts/posts.js';
import { ProfileType } from '../profiles/profile.js';
import { Context } from '../types/ctx.type.js';
import { UUIDType } from '../types/uuid.js';

// const prisma = new PrismaClient();

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',

  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLString },
    profile: {
      type: ProfileType,
      async resolve(root: { id: string }, args, ctx: Context) {
        const { prisma } = ctx;

        const profile = await prisma.profile.findUnique({
          where: {
            userId: root.id,
          },
        });

        return profile;
      },
    },
    posts: {
      type: PostListType,
      async resolve(root: { id: string }, args, ctx: Context) {
        const { prisma } = ctx;

        const post = await prisma.post.findMany({
          where: {
            authorId: root.id,
          },
        });

        return post;
      },
    },

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      async resolve(root: { id: string }, args, ctx: Context) {
        const { prisma } = ctx;

        const subscribedToUser = await prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: root.id,
              },
            },
          },
        });

        return subscribedToUser;
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      async resolve(root: { id: string }, args, ctx: Context) {
        const { prisma } = ctx;

        const userSubscribedTo = await prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: root.id,
              },
            },
          },
        });

        return userSubscribedTo;
      },
    },
  }),
});
