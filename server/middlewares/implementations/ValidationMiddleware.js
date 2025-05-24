const ResponseHelper = require('../../utils/ResponseHelper');
const IMiddleware = require('../IMiddleware');

class ValidationMiddleware extends IMiddleware {
  apply(app) {}

  static use(schema) {
    return (req, res, next) => {
      const validationOptions = {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: true,
      };

      const partsToValidate = ['body', 'params', 'query'];
      let accumulatedErrors = [];

      for (const part of partsToValidate) {
        if (schema[part]) {
          const { error, value } = schema[part].validate(
            req[part],
            validationOptions
          );
          if (error) {
            accumulatedErrors = accumulatedErrors.concat(error.details);
          } else {
            Object.assign(req[part], value);
          }
        }
      }

      if (accumulatedErrors.length > 0) {
        const errorMessages = accumulatedErrors
          .map((d) => d.message)
          .join(', ');
        return ResponseHelper.error(res, errorMessages, 400);
      }

      next();
    };
  }
}

module.exports = ValidationMiddleware;
