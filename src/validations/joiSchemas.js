const Joi = require('joi');

const registerUserSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const createAccountSchema = Joi.object({
  type: Joi.string().valid('checking', 'savings').required(),
});

const updateAccountSchema = Joi.object({
  type: Joi.string().valid('checking', 'savings').required(),
});

const createTransactionSchema = Joi.object({
  type: Joi.string().valid('deposit', 'withdrawal').required(),
  amount: Joi.number().positive().required(),
});

module.exports = { registerUserSchema, createAccountSchema, updateAccountSchema, createTransactionSchema };
