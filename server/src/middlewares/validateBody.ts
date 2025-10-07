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
      return reply.status(400).send({
        status: 400,
        message: 'Validation failed',
        errors: error.details?.map((detail: any) => detail.message) || [
          error.message,
        ],
      });
    }
  };
