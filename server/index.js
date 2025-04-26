require('dotenv').config();
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const initSocket = require('./sockets/chat');

const MiddlewareManager = require('./middlewares/MiddlewareManager');
const RouteManager = require('./routes/RouteManager');
const CronManager = require('./cron/CronManager');

const middlewareManager = new MiddlewareManager();
middlewareManager.applyMiddlewares(app);

const routeManager = new RouteManager();
routeManager.applyRoutes(app);

const cronManager = new CronManager();
cronManager.scheduleJobs();

initSocket(server);

server.listen(process.env.PORT, () => {
  console.log(`server: ${process.env.PORT}`);
});
