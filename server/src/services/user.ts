import { UsersCollection } from '../db/models/user.js';
import type { UserRequest } from '../validation/user.js';

export const getCurrentUserService = async (payload: string) => {
  const user = await UsersCollection.findById(payload);

  if (!user) {
    throw { statusCode: 404, message: 'User not found' };
  }

  return { user };
};
