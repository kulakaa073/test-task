import type { FastifyReply, FastifyRequest } from 'fastify';

export const ctrlWrapper = (
  controller: (request: FastifyRequest, reply: FastifyReply) => Promise<any>,
) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await controller(request, reply);
    } catch (error) {
      console.error('Controller error:', error);
      if (reply.sent) {
        return;
      }
      if (
        typeof error === 'object' &&
        error !== null &&
        'statusCode' in error
      ) {
        const err = error as {
          statusCode: number;
          message: string;
          details?: unknown;
        };
        return reply.status(err.statusCode).send({
          status: err.statusCode,
          message: err.message,
          details: err.details,
        });
      }
      if (error instanceof Error) {
        return reply.status(500).send({
          status: 500,
          message: error.message,
          error:
            process.env.NODE_ENV === 'development' ? error.stack : undefined,
        });
      }
      return reply.status(500).send({
        status: 500,
        message: 'An unexpected error occurred',
        error:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      });
    }
  };
};
