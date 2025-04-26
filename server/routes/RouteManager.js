const fs = require('fs');
const path = require('path');

class RouteManager {
  constructor() {
    this.routes = this.loadRoutes();
  }

  loadRoutes() {
    const routes = [];
    const implementationsPath = path.join(__dirname, 'implementations');
    const files = fs.readdirSync(implementationsPath);

    files.forEach((file) => {
      const RouteClass = require(path.join(implementationsPath, file));
      const instance = new RouteClass();
      routes.push(instance);
    });

    return routes;
  }

  applyRoutes(app) {
    this.routes.forEach((route) => {
      route.register(app);
    });
  }
}

module.exports = RouteManager;
