import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, validate, parse } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { rootSchema } from './root-schema.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },

    async preHandler(req, reply) {
      const { query } = req.body;
      const errors = validate(rootSchema, parse(query), [depthLimit(5)]);
      if (errors.length > 0) {
        await reply.send({ errors })
      }
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
