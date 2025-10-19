import Fastify from 'fastify';
import { getEnvVar } from './utils/getEnvVar.js';
import cors from '@fastify/cors';
import fastifySensible from '@fastify/sensible';
import websocket from '@fastify/websocket';
import { regularRoutes } from './routes/api.js';
import { authRoutes } from './routes/auth.js';
import { stockRoutes } from './routes/stock.ts';
import { websocketRoutes } from './routes/websocket.js';

const PORT = Number(getEnvVar('PORT', '3001'));
const CLIENT_URL = getEnvVar('CLIENT_URL', 'http://localhost:3000');

export const startServer = async () => {
  const server = Fastify({ logger: true });

  server.register(cors, { origin: CLIENT_URL });
  server.register(fastifySensible);
  server.register(websocket);

  server.register(authRoutes, { prefix: '/auth' });
  server.register(stockRoutes);
  server.register(websocketRoutes);

  server.listen({ port: PORT }, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at port ${PORT}`);
  });
};
