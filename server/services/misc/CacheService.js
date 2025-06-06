const redis = require('redis');

class CacheService {
  constructor() {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    this.client = redis.createClient({ url });
    this.client.on('error', (err) => {
      console.error('Redis error:', err.message);
    });
    this.client.connect().catch((err) => {
      console.error('Redis connection error:', err.message);
    });
  }

  async get(key) {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key, value, ttl = 300) {
    const data = JSON.stringify(value);
    if (ttl) {
      await this.client.setEx(key, ttl, data);
    } else {
      await this.client.set(key, data);
    }
  }

  async del(pattern) {
    if (!pattern.includes('*')) {
      await this.client.del(pattern);
      return;
    }
    const keys = await this.client.keys(pattern);
    if (keys.length) {
      await this.client.del(keys);
    }
  }
}

module.exports = new CacheService();
