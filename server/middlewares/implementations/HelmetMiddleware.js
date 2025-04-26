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
          styleSrc: ["'self'"],
        },
      },
      dnsPrefetchControl: false,
      expectCt: false,
      hidePoweredBy: false,
      hsts: false,
      ieNoOpen: false,
      noSniff: false,
      permittedCrossDomainPolicies: false,
      referrerPolicy: false,
      xssFilter: false,
    });
  }

  apply(app) {
    app.use(this.middleware);
  }
}

module.exports = HelmetMiddleware;
