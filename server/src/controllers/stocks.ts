import type { FastifyRequest, FastifyReply } from 'fastify';
import { getStocks } from '../services/stock.ts';

export const getStocksController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const {
    symbol,
    country,
    page = 1,
    limit = 20,
  } = request.query as {
    symbol?: string;
    country?: string;
    page?: string | number;
    limit?: string | number;
  };

  if (!symbol && !country) {
    return reply
      .status(400)
      .send({ error: 'Please provide symbol or country' });
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
  const offset = (pageNum - 1) * limitNum;

  const data = await getStocks({ symbol, country, limit: limitNum, offset });

  reply.status(200).send({
    status: 200,
    message: 'Found stocks data',
    data: data.results,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: data.total,
      totalPages: Math.ceil(data.total / limitNum),
    },
  });
};
