import type { FastifyReply, FastifyRequest } from 'fastify';
import { loginService, registerService } from '../services/auth.js';
import type { UserRequest } from '../validation/user.js';

export const loginController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const body = request.body as UserRequest;
  const token = await loginService(body);
  reply
    .status(201)
    .send({ status: 201, message: 'Successfully logged in', data: token });
};

export const registerController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  console.log('auth controller');
  const body = request.body as UserRequest;
  const user = await registerService(body);
  reply.status(201).send({
    status: 201,
    message: 'Successfully registered a user',
    data: user,
  });
};
