import type { FastifyPluginAsync } from 'fastify';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getStocksController } from '../controllers/stocks.ts';

export const stockRoutes: FastifyPluginAsync = async (app, options) => {
  app.get('/stocks', ctrlWrapper(getStocksController));
};
