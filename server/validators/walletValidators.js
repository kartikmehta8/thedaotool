const Joi = require('joi');

const sendSchema = {
  body: Joi.object({
    toAddress: Joi.string().required(),
    amount: Joi.number().min(1).required(),
  }),
};

module.exports = { sendSchema };
