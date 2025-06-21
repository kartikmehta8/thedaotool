require('dotenv').config();
require('module-alias/register');
const express = require('express');
const http = require('http');
require('@queues');
require('@utils/metrics');

const logger = require('@utils/logger');

const app = express();
const server = http.createServer(app);
const initSocket = require('./sockets/chat');

app.set('trust proxy', 1);

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
  logger.info(`server listening on ${process.env.PORT}`);
});
