import { UsersCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import type { UserRequest } from '../validation/user.js';
import { generateToken } from '../utils/jwt.js';

export const loginService = async (payload: UserRequest) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw { statusCode: 404, message: 'User not found' };
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw { statusCode: 401, message: 'Unauthorized' };
  }

  const token = generateToken(user.id);

  return { token };
};

export const registerService = async (payload: UserRequest) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) {
    throw { statusCode: 409, message: 'Email already in use' };
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};
