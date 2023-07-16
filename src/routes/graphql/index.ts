import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLError } from 'graphql';
import { rootSchema } from './root-schema.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  // const { httpErrors } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      // console.log('req', req);
      const queryString = req.body.query;
      // console.log('queryString', queryString);
      const res = await graphql({
        schema: rootSchema,
        source: queryString,
      });

      // const post = await fastify.prisma.memberType.findMany();
      // console.log('post',post);
      console.log('res', res);
      return res;
    },
  });
};

export default plugin;
