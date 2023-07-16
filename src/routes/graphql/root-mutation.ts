import { PrismaClient } from '@prisma/client';
import { GraphQLObjectType } from 'graphql';
import { PostType } from './posts/post.js';
import { StringNonNullType, UUIDNonNullType } from './types/non-null.js';
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
        title: { type: StringNonNullType },
        content: { type: StringNonNullType },
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
    }
  }),
});
