import { PrismaClient } from '@prisma/client';
import { GraphQLObjectType, GraphQLError } from 'graphql';
import { PostTypeList, PostType } from './posts/posts.js';
import { StringNonNullType } from './types/string.js';

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
      args: { id: { type: StringNonNullType } },
      resolve: async (parent, args: { id: string }) => {
        console.log('PARENT: ', parent);
        console.log('ID: ', args);

        const post = await prisma.post.findUnique({
          where: {
            id: args.id,
          },
        });
        console.log('POST: ', post);
        if (post === null) {
          throw new GraphQLError('Not found');
        }
        // if (post === null) {
        //   throw httpErrors.notFound();
        // }
        return post;
      },
    },
  }),
});
