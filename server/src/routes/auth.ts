import type { FastifyPluginAsync } from 'fastify';
import { validateBody } from '../middlewares/validateBody.js';
import { userSchema } from '../validation/user.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { loginController, registerController } from '../controllers/auth.js';
import { authenticate } from '../middlewares/authenticate.js';
import { getCurrentUserController } from '../controllers/user.js';

export const authRoutes: FastifyPluginAsync = async (app, options) => {
  app.post(
    '/login',
    { preHandler: validateBody(userSchema) },
    ctrlWrapper(loginController),
  );

  app.post(
    '/register',
    { preHandler: validateBody(userSchema) },
    ctrlWrapper(registerController),
  );

  app.get(
    '/user',
    { preHandler: authenticate },
    ctrlWrapper(getCurrentUserController),
  );
};
