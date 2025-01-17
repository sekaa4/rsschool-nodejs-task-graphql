import { GraphQLObjectType } from 'graphql';
import { PostType } from './posts/post.js';
import { ProfileType } from './profiles/profile.js';
import { Context } from './types/ctx.type.js';
import {
  ChangePostInputNonNullType,
  ChangeProfileInputNonNullType,
  ChangeUserInputNonNullType,
  CreatePostInputNonNullType,
  CreateProfileInputNonNullType,
  CreateUserInputNonNullType,
  UUIDNonNullType,
} from './types/non-null.js';
import { Void } from './types/void.js';
import { UserType } from './users/user.js';

interface CreatePost {
  dto: {
    title: string;
    content: string;
    authorId: string;
  };
}

interface ChangePost {
  id: string;
  dto: {
    title: string;
    content: string;
  };
}

interface CreateProfile {
  dto: {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
    userId: string;
  };
}

interface ChangeProfile {
  id: string;
  dto: {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
  };
}

interface CreateUser {
  dto: {
    name: string;
    balance: number;
  };
}

interface ChangeUser {
  id: string;
  dto: {
    name: string;
    balance: number;
  };
}

interface UserSubscribedTo {
  userId: string;
  authorId: string;
}

export const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',

  fields: () => ({
    createPost: {
      type: PostType,
      args: {
        dto: {
          type: CreatePostInputNonNullType,
        },
      },

      async resolve(root, args: CreatePost, ctx: Context) {
        const { prisma } = ctx;

        const newPost = await prisma.post.create({
          data: args.dto,
        });

        return newPost;
      },
    },

    changePost: {
      type: PostType,
      args: {
        id: { type: UUIDNonNullType },
        dto: { type: ChangePostInputNonNullType },
      },

      async resolve(root, { id, dto }: ChangePost, ctx: Context) {
        const { prisma } = ctx;

        const updatePost = prisma.post.update({
          where: { id },
          data: dto,
        });

        return updatePost;
      },
    },

    deletePost: {
      type: Void,
      args: {
        id: { type: UUIDNonNullType },
      },
      async resolve(root, args: { id: string }, ctx: Context) {
        const { prisma } = ctx;

        await prisma.post.delete({
          where: {
            id: args.id,
          },
        });
      },
    },

    createProfile: {
      type: ProfileType,
      args: {
        dto: {
          type: CreateProfileInputNonNullType,
        },
      },

      async resolve(root, args: CreateProfile, ctx: Context) {
        const { prisma } = ctx;

        const newProfile = await prisma.profile.create({
          data: args.dto,
        });

        return newProfile;
      },
    },

    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: UUIDNonNullType },
        dto: {
          type: ChangeProfileInputNonNullType,
        },
      },

      async resolve(root, args: ChangeProfile, ctx: Context) {
        const { prisma } = ctx;

        const changeProfile = prisma.profile.update({
          where: { id: args.id },
          data: args.dto,
        });

        return changeProfile;
      },
    },

    deleteProfile: {
      type: Void,
      args: {
        id: { type: UUIDNonNullType },
      },
      async resolve(root, args: { id: string }, ctx: Context) {
        const { prisma } = ctx;

        await prisma.profile.delete({
          where: {
            id: args.id,
          },
        });
      },
    },

    createUser: {
      type: UserType,
      args: {
        dto: {
          type: CreateUserInputNonNullType,
        },
      },

      async resolve(root, args: CreateUser, ctx: Context) {
        const { prisma } = ctx;

        const newUser = await prisma.user.create({
          data: args.dto,
        });

        return newUser;
      },
    },

    changeUser: {
      type: UserType,
      args: {
        id: { type: UUIDNonNullType },
        dto: {
          type: ChangeUserInputNonNullType,
        },
      },

      async resolve(root, args: ChangeUser, ctx: Context) {
        const { prisma } = ctx;

        const updateUser = prisma.user.update({
          where: { id: args.id },
          data: args.dto,
        });

        return updateUser;
      },
    },

    deleteUser: {
      type: Void,
      args: {
        id: { type: UUIDNonNullType },
      },
      async resolve(root, args: { id: string }, ctx: Context) {
        const { prisma } = ctx;

        await prisma.user.delete({
          where: {
            id: args.id,
          },
        });
      },
    },

    subscribeTo: {
      type: UserType,
      args: {
        userId: {
          type: UUIDNonNullType,
        },
        authorId: {
          type: UUIDNonNullType,
        },
      },
      async resolve(root, args: UserSubscribedTo, ctx: Context) {
        const { prisma } = ctx;

        return await prisma.user.update({
          where: {
            id: args.userId,
          },
          data: {
            userSubscribedTo: {
              create: {
                authorId: args.authorId,
              },
            },
          },
        });
      },
    },

    unsubscribeFrom: {
      type: Void,
      args: {
        userId: {
          type: UUIDNonNullType,
        },
        authorId: {
          type: UUIDNonNullType,
        },
      },
      async resolve(root, args: UserSubscribedTo, ctx: Context) {
        const { prisma } = ctx;

        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: args.userId,
              authorId: args.authorId,
            },
          },
        });
      },
    },
  }),
});
