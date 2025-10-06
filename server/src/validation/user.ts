import Joi from 'joi';
import '@goodrequest/joi-type-extract';

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required().messages({
    'string.min': `Password should be at least {#limit} characters long`,
    'string.max': 'Password can be at most {#limit} characters long',
    'any.required': 'Password is required',
  }),
});

export type UserRequest = Joi.extractType<typeof userSchema>;
