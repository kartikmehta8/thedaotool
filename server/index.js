const express = require('express');
const compression = require('./middlewares/Compression');
const clusterMiddleware = require('./middlewares/Clusters');
const helmet = require('./middlewares/Helmet');
const dotenv = require('dotenv');
const bodyParser = require('./middlewares/bodyParser');
const morgan = require('./middlewares/Morgan');
const cors = require('./middlewares/Cors');

// Routes Import
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

// Middlewares
app.use(cors);
app.use(compression);
app.use(helmet);
clusterMiddleware(app);
app.use(bodyParser);
app.use(morgan);

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send({
    server: 'Express',
    status: 'OK',
  });
});
