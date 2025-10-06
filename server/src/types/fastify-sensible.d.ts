import '@fastify/sensible';
import 'fastify';
import type { UserDocument } from '../db/models/user.ts';

declare module 'fastify' {
  interface FastifyReply {
    badRequest<T = any>(payload?: T): FastifyReply;
    unauthorized<T = any>(payload?: T): FastifyReply;
    notFound<T = any>(payload?: T): FastifyReply;
    internalServerError<T = any>(payload?: T): FastifyReply;
  }

  interface FastifyRequest {
    user?: UserDocument;
  }
}
