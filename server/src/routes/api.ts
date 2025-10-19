import type { FastifyPluginAsync } from 'fastify';
import { getEnvVar } from '../utils/getEnvVar.js';

const OPENAI_API_KEY = getEnvVar('OPENAI_API_KEY');

export const regularRoutes: FastifyPluginAsync = async (fastify, options) => {
  fastify.get('/', async (request, reply) => {
    return 'ello worldge!';
  });
};
