const fs = require('fs');
const path = require('path');

class MiddlewareManager {
  constructor() {
    this.middlewares = this.loadMiddlewares();
  }

  loadMiddlewares() {
    const middlewares = [];
    const implementationsPath = path.join(__dirname, 'implementations');
    const files = fs.readdirSync(implementationsPath);

    files.forEach((file) => {
      const MiddlewareClass = require(path.join(implementationsPath, file));
      const instance = new MiddlewareClass();
      middlewares.push(instance);
    });

    return middlewares;
  }

  applyMiddlewares(app) {
    this.middlewares.forEach((middleware) => {
      middleware.apply(app);
    });
  }
}

module.exports = MiddlewareManager;
