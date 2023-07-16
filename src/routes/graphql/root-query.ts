import { PrismaClient } from '@prisma/client';
import { GraphQLObjectType } from 'graphql';
import { MemberType } from './member-types/member.js';
import { MemberListType } from './member-types/members.js';
import { PostType } from './posts/post.js';
import { PostTypeList } from './posts/posts.js';
import { ProfileType } from './profiles/profile.js';
import { ProfileListType } from './profiles/profiles.js';
import { MemberIDNonNullType, UUIDNonNullType } from './types/non-null.js';

const prisma = new PrismaClient();

export const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    posts: {
      type: PostTypeList,
      args: {},

      resolve: async () => {
        const posts = await prisma.post.findMany();
        console.log('posts: ', posts);
        return posts;
      },
    },
    post: {
      type: PostType,
      args: { id: { type: UUIDNonNullType } },

      resolve: async (root, args: { id: string }) => {
        console.log('PARENT: ', root);
        console.log('ID: ', args);

        const post = await prisma.post.findUnique({
          where: {
            id: args.id,
          },
        });
        console.log('POST: ', post);
        // if (post === null) {
        //   throw new GraphQLError('Not found');
        // }
        // if (post === null) {
        //   throw httpErrors.notFound();
        // }
        return post;
      },
    },

    members: {
      type: MemberListType,

      async resolve() {
        return await prisma.memberType.findMany();
      }
    },

    member: {
      type: MemberType,
      args: {
        id: { type: MemberIDNonNullType }
      },

      async resolve(root, args: { id: string }) {
        return await prisma.memberType.findUnique({
          where: {
            id: args.id,
          },
        });
      }
    },

    profiles: {
      type: ProfileListType,

      async resolve() {
        return await prisma.profile.findMany();
      }
    },

    profile: {
      type: ProfileType,
      args: {
        id: { type: UUIDNonNullType }
      },
      async resolve(root, args: { id: string }) {
        const profile = await prisma.profile.findUnique({
          where: {
            id: args.id,
          },
        });

        return profile;
      }
    },
  }),
});
