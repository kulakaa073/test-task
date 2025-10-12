import Joi from 'joi';

export const stocksFiltersSchema = Joi.object({
  symbol: Joi.string().optional(),
  country: Joi.string().optional(),
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(20),
});

export interface StocksFilters {
  symbol?: string;
  country?: string;
  page?: number;
  limit?: number;
}
