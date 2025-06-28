const Joi = require('joi');

const applyToBountySchema = {
  body: Joi.object({
    bountyId: Joi.string().required(),
  }),
};

const submitWorkSchema = {
  body: Joi.object({
    bountyId: Joi.string().required(),
    submittedLink: Joi.string().uri().required(),
  }),
};

const uidParamSchema = {
  params: Joi.object({
    uid: Joi.string().required(),
  }),
};

const saveProfileSchema = {
  params: Joi.object({
    uid: Joi.string().required(),
  }),
  body: Joi.object({
    name: Joi.string().min(3).max(100).allow('').optional(),
    email: Joi.string().email().optional(),
    linkedin: Joi.string().uri().allow('').optional(),
    portfolio: Joi.string().uri().allow('').optional(),
    roleTitle: Joi.string().allow('').optional(),
    skills: Joi.string().allow('').optional(),
  }),
};

const getProfileOrPaymentsSchema = {
  params: Joi.object({
    uid: Joi.string().required(),
  }),
};

const unassignSelfSchema = {
  body: Joi.object({
    bountyId: Joi.string().required(),
  }),
};

module.exports = {
  applyToBountySchema,
  submitWorkSchema,
  uidParamSchema,
  saveProfileSchema,
  getProfileOrPaymentsSchema,
  unassignSelfSchema,
};
