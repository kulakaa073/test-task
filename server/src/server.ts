import Fastify from 'fastify';
import { getEnvVar } from './utils/getEnvVar.js';
import cors from '@fastify/cors';
import { regularRoutes } from './routes/api.js';

const PORT = Number(getEnvVar('PORT', '3001'));
const CLIENT_URL = getEnvVar('CLIENT_URL', 'http://localhost:3000');

export const startServer = async () => {
  const server = Fastify({ logger: true });

  server.register(cors, { origin: CLIENT_URL });

  server.register(regularRoutes);

  server.listen({ port: PORT }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at port ${PORT}`);
  });
};
