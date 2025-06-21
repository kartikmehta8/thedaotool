const client = require('prom-client');

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.75, 1, 1.5, 2, 5],
});
register.registerMetric(httpRequestDuration);

const jobFailureCounter = new client.Counter({
  name: 'job_failures_total',
  help: 'Total number of failed async jobs',
  labelNames: ['queue'],
});
register.registerMetric(jobFailureCounter);

module.exports = {
  register,
  httpRequestDuration,
  jobFailureCounter,
};
