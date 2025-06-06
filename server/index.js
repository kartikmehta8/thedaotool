require('dotenv').config();
require('module-alias/register');
const express = require('express');
const http = require('http');
require('@queues');

const app = express();
const server = http.createServer(app);
const initSocket = require('./sockets/chat');

const MiddlewareManager = require('@middlewares/MiddlewareManager');
const RouteManager = require('@routes/RouteManager');
const CronManager = require('@cron/CronManager');
const ErrorHandlerMiddleware = require('@middlewares/implementations/core/ErrorHandlerMiddleware');

const middlewareManager = new MiddlewareManager();
middlewareManager.applyMiddlewares(app);

const routeManager = new RouteManager();
routeManager.applyRoutes(app);

new ErrorHandlerMiddleware().apply(app);

const cronManager = new CronManager();
cronManager.scheduleJobs();

initSocket(server);

server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`server: ${process.env.PORT}`);
});
