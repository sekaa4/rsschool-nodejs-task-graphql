import { PrismaClient } from '@prisma/client';
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { PostType } from './posts/post.js';
import { ProfileType } from './profiles/profile.js';
import { MemberTypeId } from './types/member-id.js';
import {
  BooleanNonNullType,
  FloatNonNullType,
  IntNonNullType,
  MemberIdNonNullType,
  StringNonNullType,
  UUIDNonNullType,
} from './types/non-null.js';
import { Void } from './types/void.js';
import { UserType } from './users/user.js';

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

interface CreateUser {
  name: string;
  balance: number;
}

interface UpdateUser {
  id: string;
  name: string;
  balance: number;
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
        id: { type: UUIDNonNullType },
      },
      async resolve(root, args: { id: string }) {
        const res = await prisma.post.delete({
          where: {
            id: args.id,
          },
        });

        console.log('DELETE', res);
      },
    },

    createProfile: {
      type: ProfileType,
      args: {
        isMale: { type: BooleanNonNullType },
        yearOfBirth: { type: IntNonNullType },
        memberTypeId: { type: MemberIdNonNullType },
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
        memberTypeId: { type: MemberTypeId },
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
        id: { type: UUIDNonNullType },
      },
      async resolve(root, args: { id: string }) {
        const res = await prisma.profile.delete({
          where: {
            id: args.id,
          },
        });

        console.log('DELETE', res);
      },
    },

    createUser: {
      type: UserType,
      args: {
        name: { type: StringNonNullType },
        balance: { type: FloatNonNullType },
      },

      async resolve(root, args: CreateUser) {
        const newUser = await prisma.user.create({
          data: args,
        });

        return newUser;
      },
    },

    updateUser: {
      type: UserType,
      args: {
        id: { type: UUIDNonNullType },
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
      },

      async resolve(root, args: UpdateUser) {
        const updateUser = prisma.user.update({
          where: { id: args.id },
          data: args,
        });

        return updateUser;
      },
    },

    deleteUser: {
      type: Void,
      args: {
        id: { type: UUIDNonNullType },
      },
      async resolve(root, args: { id: string }) {
        const res = await prisma.user.delete({
          where: {
            id: args.id,
          },
        });

        console.log('DELETE', res);
      },
    },
  }),
});
