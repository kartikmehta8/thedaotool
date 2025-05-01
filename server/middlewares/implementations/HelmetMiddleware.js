const helmet = require('helmet');
const IMiddleware = require('../IMiddleware');

class HelmetMiddleware extends IMiddleware {
  constructor() {
    super();
    this.middleware = helmet({
      frameguard: { action: 'deny' },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", 'https:'],
        },
      },
      hsts: process.env.NODE_ENV === 'production' && {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    });
  }

  apply(app) {
    app.use(this.middleware);
  }
}

module.exports = HelmetMiddleware;
