const morgan = require('morgan');
const IMiddleware = require('../IMiddleware');

class MorganMiddleware extends IMiddleware {
  constructor() {
    super();
    this.middleware = morgan('dev');
  }

  apply(app) {
    app.use(this.middleware);
  }
}

module.exports = MorganMiddleware;
