const bodyParser = require('body-parser');
const IMiddleware = require('../IMiddleware');

class BodyParserMiddleware extends IMiddleware {
  constructor() {
    super();
    this.middleware = bodyParser.json();
  }

  apply(app) {
    app.use(this.middleware);
  }
}

module.exports = BodyParserMiddleware;
