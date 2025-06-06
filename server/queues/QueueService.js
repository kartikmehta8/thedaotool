const Queue = require('bull');

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
        console.info(`[${name}] ${start} succeeded`);
      } catch (err) {
        console.error(`[${name}] ${start} failed`, err.message);
        throw err;
      }
    });
    queue.on('failed', (job, err) => {
      console.error(`Job '${name}' failed`, err.message);
    });
    queue.on('completed', () => {
      console.info(`Job '${name}' completed`);
    });
    console.info(`Queue '${name}' started with concurrency ${concurrency}`);
  }
}

module.exports = new QueueService();
