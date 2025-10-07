import Joi from 'joi';

export const stocksFiltersSchema = Joi.object({
  symbol: Joi.string(),
  name: Joi.string(),
  country: Joi.string(),
});
