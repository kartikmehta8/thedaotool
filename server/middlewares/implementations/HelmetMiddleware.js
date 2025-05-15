const helmet = require('helmet');
const IMiddleware = require('../IMiddleware');

class HelmetMiddleware extends IMiddleware {
  constructor() {
    super();

    this.middleware = helmet({
      frameguard: { action: 'deny' },
      noSniff: true,

      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'none'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", 'data:'],
        },
      },

      hsts:
        process.env.NODE_ENV === 'production'
          ? {
              maxAge: 31536000,
              includeSubDomains: true,
              preload: true,
            }
          : false,
    });
  }

  apply(app) {
    app.disable('x-powered-by');
    app.use(this.middleware);

    app.use((req, res, next) => {
      res.removeHeader('Server');
      next();
    });
  }
}

module.exports = HelmetMiddleware;
