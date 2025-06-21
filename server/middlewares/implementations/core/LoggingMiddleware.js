const pinoHttp = require('pino-http');
const IMiddleware = require('@middlewares/IMiddleware');
const logger = require('@utils/logger');

class LoggingMiddleware extends IMiddleware {
  constructor() {
    super();
    this.middleware = pinoHttp({
      logger,
      customProps: (req) => ({
        user: req.user?.uid || null,
        ip: req.ip,
      }),
    });
  }

  apply(app) {
    app.use(this.middleware);
  }
}

module.exports = LoggingMiddleware;
