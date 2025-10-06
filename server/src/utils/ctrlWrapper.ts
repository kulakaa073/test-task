import type { FastifyReply, FastifyRequest } from 'fastify';

export const ctrlWrapper = (
  controller: (request: FastifyRequest, reply: FastifyReply) => Promise<any>,
) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await controller(request, reply);
    } catch (error) {
      reply.send(error);
    }
  };
};
