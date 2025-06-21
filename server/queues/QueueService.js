const Queue = require('bull');
const logger = require('@utils/logger');
const { jobFailureCounter } = require('@utils/metrics');

class QueueService {
  constructor() {
    this.queues = {};
    this.redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
  }

  getQueue(name) {
    if (!this.queues[name]) {
      this.queues[name] = new Queue(name, this.redisUrl, {
        defaultJobOptions: { attempts: 3, removeOnComplete: true },
      });
    }
    return this.queues[name];
  }

  async add(name, data = {}) {
    const queue = this.getQueue(name);
    await queue.add(name, data);
  }

  process(name, handler, concurrency = 1) {
    const queue = this.getQueue(name);
    queue.process(name, concurrency, async (job) => {
      const start = new Date().toISOString();
      try {
        await handler(job.data);
        logger.info(
          { action: 'job_success', queue: name },
          `Job '${name}' succeeded`
        );
      } catch (err) {
        logger.error(
          { action: 'job_error', queue: name, err: err.message },
          `Job '${name}' failed`
        );
        jobFailureCounter.inc({ queue: name });
        throw err;
      }
    });
    queue.on('failed', (job, err) => {
      logger.error(
        { action: 'job_failed', queue: name, err: err.message },
        `Job '${name}' failed`
      );
      jobFailureCounter.inc({ queue: name });
    });
    queue.on('completed', () => {
      logger.info(
        { action: 'job_completed', queue: name },
        `Job '${name}' completed`
      );
    });
    logger.info(
      { action: 'queue_started', queue: name, concurrency },
      `Queue '${name}' started`
    );
  }
}

module.exports = new QueueService();
