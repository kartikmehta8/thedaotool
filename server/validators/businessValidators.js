const Joi = require('joi');

const createContractSchema = {
  body: Joi.object({
    values: Joi.object({
      name: Joi.string().min(3).max(100).required(),
      description: Joi.string().min(10).max(2000).required(),
      deadline: Joi.date().iso().required(),
      amount: Joi.number().min(1).required(),
      tags: Joi.string().optional(),
    }).required(),
    userId: Joi.string().required(),
  }),
};

const updateContractSchema = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
  body: Joi.object({
    name: Joi.string().min(3).max(100).optional(),
    description: Joi.string().min(10).max(2000).optional(),
    deadline: Joi.date().iso().optional(),
    amount: Joi.number().min(1).optional(),
    status: Joi.string()
      .valid('open', 'in_progress', 'submitted', 'pending_payment', 'closed')
      .optional(),
    submittedLink: Joi.string().uri().optional(),
    contractorId: Joi.string().allow(null).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
  }),
};

const contractIdParamSchema = {
  params: Joi.object({
    contractId: Joi.string().required(),
  }),
};

const contractorIdParamSchema = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

const updateContractorSchema = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
  body: Joi.object({
    name: Joi.string().min(3).max(100).optional(),
    email: Joi.string().email().optional(),
    linkedin: Joi.string().uri().optional(),
    portfolio: Joi.string().uri().optional(),
    roleTitle: Joi.string().optional(),
    accountNumber: Joi.string()
      .pattern(/^\d{10}$/)
      .optional(),
    routingNumber: Joi.string()
      .pattern(/^\d{10}$/)
      .optional(),
    skills: Joi.string().optional(),
  }),
};

const uidParamSchema = {
  params: Joi.object({
    uid: Joi.string().required(),
  }),
};

const uidAndBodySchema = {
  params: Joi.object({
    uid: Joi.string().required(),
  }),
  body: Joi.object({
    apiKey: Joi.string().optional(),
    companyName: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(2000).optional(),
    discordAccessToken: Joi.string().optional(),
    discordChannelId: Joi.string().optional(),
    discordEnabled: Joi.boolean().optional(),
    discordGuild: Joi.string().allow('').optional(),
    discordSendMode: Joi.string().allow('').optional(),
    email: Joi.string().email().required(),
    githubToken: Joi.string().allow('').optional(),
    industry: Joi.string().optional(),
    repo: Joi.string().allow('').optional(),
    website: Joi.string().uri().optional(),
  }),
};

module.exports = {
  createContractSchema,
  updateContractSchema,
  contractIdParamSchema,
  contractorIdParamSchema,
  updateContractorSchema,
  uidParamSchema,
  uidAndBodySchema,
};
