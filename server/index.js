const express = require('express');
const http = require('http');
const cron = require('node-cron');

const compression = require('./middlewares/Compression');
const clusterMiddleware = require('./middlewares/Clusters');
const helmet = require('./middlewares/Helmet');
const dotenv = require('dotenv');
const bodyParser = require('./middlewares/bodyParser');
const morgan = require('./middlewares/Morgan');
const cors = require('./middlewares/Cors');

// Routes Import
const authRoutes = require('./routes/auth');
const githubRoutes = require('./routes/github');
const paymanRoutes = require('./routes/payman');
const discordRoutes = require('./routes/discord');
const businessRoutes = require('./routes/business');
const contractorRoutes = require('./routes/contractor');

// Jobs
const syncGitHubIssues = require('./jobs/syncGitHubIssues');

dotenv.config();

const app = express();
const server = http.createServer(app);
const initSocket = require('./sockets/chat');

// Middlewares
app.use(cors);
app.use(compression);
app.use(helmet);
clusterMiddleware(server);
app.use(bodyParser);
app.use(morgan);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payman', paymanRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/discord', discordRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/contractor', contractorRoutes);

// Socket
initSocket(server);

app.get('/', (req, res) => {
  res.send({
    server: 'Express from Node.js',
    status: 'OK',
  });
});

cron.schedule('*/20 * * * * *', async () => {
  console.log('Running GitHub issue sync...');
  await syncGitHubIssues();
});
