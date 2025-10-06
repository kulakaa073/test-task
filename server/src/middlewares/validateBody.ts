import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ObjectSchema } from 'joi';

export const validateBody =
  (schema: ObjectSchema) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await schema.validateAsync(request.body, {
        abortEarly: false,
      });
    } catch (error: any) {
      reply.badRequest({ errors: error.details });
    }
  };
