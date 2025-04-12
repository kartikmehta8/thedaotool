const helmet = require('helmet');

module.exports = helmet({
  frameguard: {
    action: 'deny',
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com'],
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
