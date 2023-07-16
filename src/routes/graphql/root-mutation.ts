import { PrismaClient } from '@prisma/client';
import { GraphQLObjectType, GraphQLError, GraphQLString } from 'graphql';
import { title } from 'process';
import { PostTypeList, PostType } from './posts/posts.js';
import { StringNonNullType } from './types/string.js';
import { UUIDType } from './types/uuid.js';
import { UserType } from './users/users.js';

const prisma = new PrismaClient();

interface CreatePost {
  title: string;
  content: string;
  authorId: string;
}

export const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createPost: {
      type: PostType,
      args: {
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        authorId: { type: UUIDType },
      },

      async resolve(parent, args: CreatePost) {
        const newPost = await prisma.post.create({
          data: args,
        });

        return newPost;
      },
    },

    // post: {
    //   type: PostType,
    //   args: { id: { type: StringNonNullType } },
    //   resolve: async (parent, args: { id: string }) => {
    //     console.log('PARENT: ', parent)
    //     console.log('ID: ', args)
    //     const post = await prisma.post.findUnique({
    //       where: {
    //         id: args.id,
    //       },
    //     });
    //     console.log('POST: ', post)
    //     // if (post === null) {
    //     //   throw new GraphQLError('Not found');
    //     // }
    //     // if (post === null) {
    //     //   throw httpErrors.notFound();
    //     // }
    //     return post;
    //   }
    // }
  }),
});
