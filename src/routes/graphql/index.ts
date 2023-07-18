import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';
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
      const { query, variables } = req.body;

      const res = await graphql({
        schema: rootSchema,
        source: query,
        variableValues: variables,
      });

      return res;
    },
  });
};

export default plugin;
