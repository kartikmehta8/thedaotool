const express = require('express');
const http = require('http');
const cron = require('node-cron');
const dotenv = require('dotenv');

dotenv.config();

const MiddlewareManager = require('./middlewares/MiddlewareManager');
const RouteManager = require('./routes/RouteManager');

// Jobs
const syncGitHubIssues = require('./jobs/syncGitHubIssues');

const app = express();
const server = http.createServer(app);
const initSocket = require('./sockets/chat');

// Middlewares.
const middlewareManager = new MiddlewareManager();
middlewareManager.applyMiddlewares(app);

// Routes.
const routeManager = new RouteManager();
routeManager.applyRoutes(app);

// Socket
initSocket(server);

app.get('/', (req, res) => {
  res.send({
    server: 'Express',
    status: 'OK',
  });
});

cron.schedule('*/20 * * * * *', async () => {
  console.log('Running GitHub issue sync...');
  await syncGitHubIssues();
});

server.listen(process.env.PORT, () => {
  console.log(`server: ${process.env.PORT}`);
});
