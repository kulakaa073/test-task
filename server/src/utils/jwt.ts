import jwt from 'jsonwebtoken';
import { getEnvVar } from './getEnvVar.js';

export const generateToken = (payload: Object) => {
  return jwt.sign(payload, getEnvVar('JWT_SECRET'), { expiresIn: '1d' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, getEnvVar('JWT_SECRET'));
};
