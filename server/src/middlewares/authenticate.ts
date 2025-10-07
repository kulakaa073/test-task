import type { FastifyReply, FastifyRequest } from 'fastify';
import { verifyToken } from '../utils/jwt.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return reply.status(401).send({
        status: 401,
        message: 'Please provide Authorization header',
      });
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return reply.status(401).send({
        status: 401,
        message: 'Auth header should be of type Bearer',
      });
    }

    const data = verifyToken(token);

    const user = await UsersCollection.findById(data);

    if (!user) {
      return reply.status(401).send({
        status: 401,
        message: 'User not found',
      });
    }
    request.user = user;
  } catch (error) {
    return reply.status(401).send({
      status: 401,
      message: 'Token is invalid',
    });
  }
};
