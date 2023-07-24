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

import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import DataLoader from 'dataloader';

export const RootQueryType = new GraphQLObjectType({
  name: 'Query',

  fields: () => ({
    users: {
      type: UserListType,
      async resolve(root, args, ctx: Context, info) {
        const { prisma, loaders } = ctx;
        let loader = loaders.get(info.fieldNodes);
        const parsedResolveInfoFragment = parseResolveInfo(info);
        const { fields } = simplifyParsedResolveInfoFragmentWithType(
          parsedResolveInfoFragment as ResolveTree,
          UserListType,
        );
        const fieldsKeys = Object.keys(fields) as readonly string[];

        if (!loader) {
          loader = new DataLoader(async (keys) => {
            const fieldsKeys = keys[0].split(',');
            const dataUsers = await prisma.user.findMany({
              include: {
                subscribedToUser: fieldsKeys.includes('subscribedToUser'),
                userSubscribedTo: fieldsKeys.includes('userSubscribedTo'),
              },
            });
            return [dataUsers];
          });
          loaders.set(fieldsKeys, loader);
        }
        const result = loader.load(fieldsKeys.join());
        ctx.dataUsers = fieldsKeys;
        return result;
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
  }),
});
