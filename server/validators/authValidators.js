const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('contributor', 'organization').required(),
});

const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

const verifyTokenSchema = Joi.object({
  email: Joi.string().email().required(),
  token: Joi.string().required(),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  token: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

module.exports = {
  loginSchema,
  signupSchema,
  emailSchema,
  verifyTokenSchema,
  resetPasswordSchema,
};
