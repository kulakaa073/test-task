import jwt from 'jsonwebtoken';
import { getEnvVar } from './getEnvVar.js';

export const generateToken = (payload: string) => {
  return jwt.sign(payload, getEnvVar('JWT_SECRET'), { expiresIn: '1d' });
};

export const verifyToken = (payload: string) => {
  return jwt.verify(payload, getEnvVar('JWT_SECRET'));
};
