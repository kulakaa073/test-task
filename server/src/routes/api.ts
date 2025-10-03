import type { FastifyPluginAsync } from 'fastify';
import { getEnvVar } from '../utils/getEnvVar.js';

const OPENAI_API_KEY = getEnvVar('OPENAI_API_KEY');

export const regularRoutes: FastifyPluginAsync = async (fastify, options) => {
  fastify.get('/', async (request, reply) => {
    return 'ello worldge!';
  });

  fastify.post('/session', async (req, reply) => {
    const { sdp } = req.body as { sdp: string };

    const r = await fetch('https://api.openai.com/v1/realtime', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/sdp',
      },
      body: sdp,
    });

    const answer = await r.text();
    return reply.type('application/sdp').send(answer);
  });
};
