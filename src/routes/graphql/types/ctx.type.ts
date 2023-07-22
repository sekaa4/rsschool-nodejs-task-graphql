import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/index.js';
import DataLoader from 'dataloader';

export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined,
    DefaultArgs
  >;
  loaders: WeakMap<object, DataLoader<string, unknown>>;
  dataUsers?: Record<string, unknown>[];
}
