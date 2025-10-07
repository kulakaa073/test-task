import Joi from 'joi';

export const userSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Email is not valid',
  }),
  password: Joi.string().min(8).max(128).required().messages({
    'string.min': `Password should be at least {#limit} characters long`,
    'string.max': 'Password can be at most {#limit} characters long',
    'any.required': 'Password is required',
  }),
});

export type UserRequest = { email: string; password: string };
