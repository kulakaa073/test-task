import type { FastifyReply, FastifyRequest } from 'fastify';

export const ctrlWrapper = (
  controller: (request: FastifyRequest, reply: FastifyReply) => Promise<any>,
) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await controller(request, reply);
    } catch (error) {
      // Log the full error for debugging
      console.error('Controller error:', error);

      // Check if response was already sent
      if (reply.sent) {
        return;
      }

      // Handle custom error objects with statusCode
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

      // Handle Error instances
      if (error instanceof Error) {
        return reply.status(500).send({
          status: 500,
          message: error.message,
          error:
            process.env.NODE_ENV === 'development' ? error.stack : undefined,
        });
      }

      // Handle unknown error types
      return reply.status(500).send({
        status: 500,
        message: 'An unexpected error occurred',
        error:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      });
    }
  };
};
