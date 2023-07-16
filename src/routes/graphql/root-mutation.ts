import { PrismaClient } from '@prisma/client';
import { GraphQLBoolean, GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql';
import { PostType } from './posts/post.js';
import { ProfileType } from './profiles/profile.js';
import { MemberIDType } from './types/member-id.js';
import { BooleanNonNullType, IntNonNullType, MemberIDNonNullType, StringNonNullType, UUIDNonNullType } from './types/non-null.js';
import { Void } from './types/void.js';

const prisma = new PrismaClient();

interface CreatePost {
  title: string;
  content: string;
  authorId: string;
}

interface UpdatePost {
  title: string;
  content: string;
  id: string;
}

interface CreateProfile {
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: string;
  userId: string;
}

interface UpdateProfile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: string;
}

export const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',

  fields: () => ({
    createPost: {
      type: PostType,
      args: {
        title: { type: StringNonNullType },
        content: { type: StringNonNullType },
        authorId: { type: UUIDNonNullType },
      },

      async resolve(root, args: CreatePost) {
        const newPost = await prisma.post.create({
          data: args,
        });

        return newPost;
      },
    },

    updatePost: {
      type: PostType,
      args: {
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        id: { type: UUIDNonNullType },
      },

      async resolve(root, args: UpdatePost) {
        // const newPost = await prisma.post.create({
        //   data: args,
        // });
        const updatePost = prisma.post.update({
          where: { id: args.id },
          data: args,
        });

        return updatePost;
      },
    },

    deletePost: {
      type: Void,
      args: {
        id: { type: UUIDNonNullType }
      },
      async resolve(root, args: { id: string }) {
        const res = await prisma.post.delete({
          where: {
            id: args.id,
          },
        });

        console.log('DELETE', res);
      }
    },





    createProfile: {
      type: ProfileType,
      args: {
        isMale: { type: BooleanNonNullType },
        yearOfBirth: { type: IntNonNullType },
        memberTypeId: { type: MemberIDNonNullType },
        userId: { type: UUIDNonNullType },
      },

      async resolve(root, args: CreateProfile) {
        const newProfile = await prisma.profile.create({
          data: args,
        });

        return newProfile;
      },
    },

    updateProfile: {
      type: ProfileType,
      args: {
        id: { type: UUIDNonNullType },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        memberTypeId: { type: MemberIDType },
      },

      async resolve(root, args: UpdateProfile) {
        const updateProfile = prisma.profile.update({
          where: { id: args.id },
          data: args,
        });

        return updateProfile;
      },
    },

    deleteProfile: {
      type: Void,
      args: {
        id: { type: UUIDNonNullType }
      },
      async resolve(root, args: { id: string }) {
        const res = await prisma.profile.delete({
          where: {
            id: args.id,
          },
        });

        console.log('DELETE', res);
      }
    }
  }),
});
