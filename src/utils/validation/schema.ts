import Joi from 'joi';

export const transactionSchema = Joi.object({
  amount: Joi.number().positive().required(),
  description: Joi.string().optional(),
});

export const tradeMarketSchema = Joi.object({
  share_id: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().positive().required(),
});

export const orderLimitSchema = Joi.object({
  share_id: Joi.number().integer().positive().required(),
  portfolio_id: Joi.number().integer().positive().required(),
  order_type: Joi.string().valid('BUY', 'SELL').required(),
  quantity: Joi.number().integer().positive().required(),
  price: Joi.number().positive().required(),
});

export const cancelLimitOrderSchema = Joi.object().valid(null, {});

export const createPortfolioSchema = Joi.object().valid(null, {});

export const updateSharePriceSchema = Joi.object({
  newPrice: Joi.number().positive().required(),
});

export const updateUserDetailsSchema = Joi.object({
  username: Joi.string().optional(),
  email: Joi.string().email().optional(),
});

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});