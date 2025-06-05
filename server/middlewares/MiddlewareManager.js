const fs = require('fs');
const path = require('path');

class MiddlewareManager {
  constructor() {
    this.middlewares = this.loadMiddlewares();
  }

  loadMiddlewares() {
    const implementationsPath = path.join(__dirname, 'implementations');
    const files = this.getFilesRecursively(implementationsPath);

    return files.map((file) => {
      const MiddlewareClass = require(file);
      return new MiddlewareClass();
    });
  }

  getFilesRecursively(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files = files.concat(this.getFilesRecursively(fullPath));
      } else if (entry.isFile() && fullPath.endsWith('.js')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  applyMiddlewares(app) {
    this.middlewares.forEach((middleware) => {
      middleware.apply(app);
    });
  }
}

module.exports = MiddlewareManager;
