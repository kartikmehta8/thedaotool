const express = require('express');
const compression = require('./middlewares/Compression');
const clusterMiddleware = require('./middlewares/Clusters');
const helmet = require('./middlewares/Helmet');
const dotenv = require('dotenv');
const bodyParser = require('./middlewares/bodyParser');
const morgan = require('./middlewares/Morgan');

// Routes Import
const sampleRoutes = require('./routes/sample');

dotenv.config();

const app = express();

// Middlewares
app.use(compression);
app.use(helmet);
clusterMiddleware(app);
app.use(bodyParser);
app.use(morgan);

// Routes
app.use('/sample', sampleRoutes);

app.get('/', (req, res) => {
  res.send({
    server: 'Express',
    status: 'OK',
  });
});
