import { PrismaClient } from '@prisma/client';
import { GraphQLObjectType } from 'graphql';
import { PostType } from './posts/post.js';
import { PostTypeList } from './posts/posts.js';
import { UUIDNonNullType } from './types/non-null.js';

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
  }),
});
