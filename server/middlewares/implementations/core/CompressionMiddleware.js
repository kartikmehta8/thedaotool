const compression = require('compression');
const IMiddleware = require('@middlewares/IMiddleware');

class CompressionMiddleware extends IMiddleware {
  constructor() {
    super();
    this.middleware = compression({
      level: 6,
      threshold: 10 * 100,
      filter: (req, res) => {
        if (req.headers['x-no-compression']) return false;
        return compression.filter(req, res);
      },
    });
  }

  apply(app) {
    app.use(this.middleware);
  }
}

module.exports = CompressionMiddleware;
