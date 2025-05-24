const Joi = require('joi');

const initiateOAuthSchema = {
  query: Joi.object({
    userId: Joi.string().required(),
  }),
};

const callbackSchema = {
  query: Joi.object({
    code: Joi.string().required(),
    state: Joi.string().required(),
  }),
};

const uidParamSchema = {
  params: Joi.object({
    uid: Joi.string().required(),
  }),
};

const saveRepoSchema = {
  params: Joi.object({
    uid: Joi.string().required(),
  }),
  body: Joi.object({
    repo: Joi.string().required(),
  }),
};

module.exports = {
  initiateOAuthSchema,
  callbackSchema,
  uidParamSchema,
  saveRepoSchema,
};
