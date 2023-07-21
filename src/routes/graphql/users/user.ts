import DataLoader from 'dataloader';
import { GraphQLString, GraphQLObjectType, GraphQLList } from 'graphql';
import { PostListType } from '../posts/posts.js';
import { ProfileType } from '../profiles/profile.js';
import { Context } from '../types/ctx.type.js';
import { UUIDType } from '../types/uuid.js';

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',

  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLString },
    profile: {
      type: ProfileType,
      async resolve(root: { id: string }, args, ctx: Context, info) {
        const { prisma, loaders } = ctx;

        let loader = loaders.get(info.fieldNodes);

        if (!loader) {
          loader = new DataLoader(async (keys: readonly string[]) => {
            const profiles = await prisma.profile.findMany({
              where: {
                userId: {
                  in: keys as string[]
                },
              },
            });


            const result = keys.map((key: string) => profiles.find(profile => profile.userId === key));

            return result;
          })

          loaders.set(info.fieldNodes, loader);
        }

        const profile = loader.load(root.id)

        return profile;
      },
    },

    posts: {
      type: PostListType,
      async resolve(root: { id: string }, args, ctx: Context, info) {
        const { prisma, loaders } = ctx;

        let loader = loaders.get(info.fieldNodes);

        if (!loader) {
          loader = new DataLoader(async (keys: readonly string[]) => {
            const posts = await prisma.post.findMany({
              where: {
                authorId: {
                  in: keys as string[]
                },
              },
            });


            const postsResult = keys.map((key: string) => posts.filter(post => post.authorId === key));

            return postsResult;
          })

          loaders.set(info.fieldNodes, loader);
        }

        const post = loader.load(root.id)

        return post;
      },
    },

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      async resolve(root: { id: string }, args, ctx: Context, info) {
        const { prisma, loaders, dataUsers } = ctx;

        if (dataUsers) {
          const user = dataUsers.find(user => user.id === root.id);

          return user && user.userSubscribedTo;
        }

        //universal resolve the results
        let loader = loaders.get(info.fieldNodes);

        if (!loader) {
          loader = new DataLoader(async (keys: readonly string[]) => {
            const subscribersToUser = await prisma.user.findMany({
              include: {
                userSubscribedTo: false,
                subscribedToUser: true,
              },
              where: {
                subscribedToUser: {
                  some: {
                    subscriberId: {
                      in: keys as string[],
                    }
                  },
                },
              },
            });


            const userSubscribedToResults = keys.map((key: string) => subscribersToUser.filter(subscriber => subscriber.subscribedToUser.find((user) => user.subscriberId === key)));

            return userSubscribedToResults;
          })

          loaders.set(info.fieldNodes, loader);
        }

        const userSubscribedTo = loader.load(root.id)


        //simply resolve the results
        // const userSubscribedTo = prisma.user.findMany({
        //   where: {
        //     subscribedToUser: {
        //       some: {
        //         subscriberId: root.id,
        //       },
        //     },
        //   },
        // });

        return userSubscribedTo;
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      async resolve(root: { id: string }, args, ctx: Context, info) {
        const { prisma, loaders, dataUsers } = ctx;

        if (dataUsers) {
          // const userId = root.id;
          const user = dataUsers.find(user => user.id === root.id);

          return user && user.subscribedToUser;
        }

        //universal resolve the results
        let loader = loaders.get(info.fieldNodes);

        if (!loader) {
          loader = new DataLoader(async (keys: readonly string[]) => {
            const usersSubscribeTo = await prisma.user.findMany({
              include: {
                userSubscribedTo: true,
                subscribedToUser: false,
              },
              where: {
                userSubscribedTo: {
                  some: {
                    authorId: {
                      in: keys as string[],
                    }
                  },
                },
              },
            });


            const result = keys.map((key: string) => usersSubscribeTo.filter(user => user.userSubscribedTo.find((user) => user.authorId === key)));

            return result;
          })

          loaders.set(info.fieldNodes, loader);
        }

        const subscribedToUser = loader.load(root.id)

        //simply resolve the results
        // const subscribedToUser = prisma.user.findMany({
        //   where: {
        //     userSubscribedTo: {
        //       some: {
        //         authorId: root.id,
        //       },
        //     },
        //   },
        // });

        return subscribedToUser;
      },
    },
  }),
});
