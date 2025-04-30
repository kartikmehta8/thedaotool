const rateLimit = require('express-rate-limit');
const IMiddleware = require('../IMiddleware');

class RateLimitMiddleware extends IMiddleware {
  constructor() {
    super();

    this.middleware = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes.
      max: 100, // Limit each IP to 100 requests per windowMs.
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: 'Too many requests. Please try again later.',
      },
    });
  }

  apply(app) {
    app.use(this.middleware);
  }
}

module.exports = RateLimitMiddleware;
