import { GraphQLObjectType } from 'graphql';
import { MemberType } from './member-types/member.js';
import { MemberListType } from './member-types/members.js';
import { PostType } from './posts/post.js';
import { PostListType } from './posts/posts.js';
import { ProfileType } from './profiles/profile.js';
import { ProfileListType } from './profiles/profiles.js';
import { Context } from './types/ctx.type.js';
import { MemberIdNonNullType, UUIDNonNullType } from './types/non-null.js';
import { UserType } from './users/user.js';

import { UserListType } from './users/users.js';

export const RootQueryType = new GraphQLObjectType({
  name: 'Query',

  fields: () => ({
    posts: {
      type: PostListType,
      args: {},

      resolve: async (root, args, ctx: Context) => {
        const { prisma } = ctx;

        const posts = await prisma.post.findMany();

        return posts;
      },
    },
    post: {
      type: PostType,
      args: { id: { type: UUIDNonNullType } },

      resolve: async (root, args: { id: string }, ctx: Context) => {
        const { prisma } = ctx;

        const post = await prisma.post.findUnique({
          where: {
            id: args.id,
          },
        });
        return post;
      },
    },

    memberTypes: {
      type: MemberListType,

      async resolve(root, args, ctx: Context) {
        const { prisma } = ctx;

        return await prisma.memberType.findMany();
      },
    },

    memberType: {
      type: MemberType,
      args: {
        id: { type: MemberIdNonNullType },
      },

      async resolve(root, args: { id: string }, ctx: Context) {
        const { prisma } = ctx;

        return await prisma.memberType.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    },

    profiles: {
      type: ProfileListType,

      async resolve(root, args, ctx: Context) {
        const { prisma } = ctx;

        return await prisma.profile.findMany();
      },
    },

    profile: {
      type: ProfileType,
      args: {
        id: { type: UUIDNonNullType },
      },
      async resolve(root, args: { id: string }, ctx: Context) {
        const { prisma } = ctx;

        const profile = await prisma.profile.findUnique({
          where: {
            id: args.id,
          },
        });

        return profile;
      },
    },

    users: {
      type: UserListType,
      async resolve(root, args, ctx: Context) {
        const { prisma } = ctx;

        return prisma.user.findMany();
      },
    },

    user: {
      type: UserType,
      args: { id: { type: UUIDNonNullType } },
      async resolve(root, args: { id: string }, ctx: Context) {
        const { prisma } = ctx;

        const user = await prisma.user.findUnique({
          where: {
            id: args.id,
          },
        });

        return user;
      },
    },
  }),
});
