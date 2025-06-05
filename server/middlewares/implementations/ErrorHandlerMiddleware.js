const IMiddleware = require('../IMiddleware');
const ResponseHelper = require('../../utils/ResponseHelper');

class ErrorHandlerMiddleware extends IMiddleware {
  apply(app) {
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
      console.error(err);
      const status = err.status || 500;
      const message = err.message || 'Internal server error';
      ResponseHelper.error(res, message, status);
    });
  }
}

module.exports = ErrorHandlerMiddleware;
