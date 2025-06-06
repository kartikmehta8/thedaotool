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
    queue.process(concurrency, async (job) => {
      const start = new Date().toISOString();
      try {
        await handler(job.data);
        console.info(`[${name}] ${start} succeeded`);
      } catch (err) {
        console.error(`[${name}] ${start} failed`, err.message);
        throw err;
      }
    });
  }
}

module.exports = new QueueService();
