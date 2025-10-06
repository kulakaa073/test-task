import type { FastifyReply, FastifyRequest } from 'fastify';
import { loginService, registerService } from '../services/auth.js';
import type { UserRequest } from '../validation/user.js';
import { getCurrentUserService } from '../services/user.js';

export const getCurrentUserController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const userId = request.user.id;
  const user = await getCurrentUserService(userId);

  reply.status(200).send({
    status: 200,
    message: 'Successfully found a user',
    data: user,
  });
};
