const IMiddleware = require('@middlewares/IMiddleware');
const ResponseHelper = require('@utils/ResponseHelper');
const logger = require('@utils/logger');

class ErrorHandlerMiddleware extends IMiddleware {
  apply(app) {
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
      const status = err.status || 500;
      const message = err.message || 'Internal server error';
      logger.error({ err, action: 'error_handler', status }, message);
      ResponseHelper.error(res, message, status);
    });
  }
}

module.exports = ErrorHandlerMiddleware;
