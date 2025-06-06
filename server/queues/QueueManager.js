const fs = require('fs');
const path = require('path');
const QueueService = require('./QueueService');

class QueueManager {
  constructor() {
    this.instances = this.loadQueues();
  }

  loadQueues() {
    const implementationsPath = path.join(__dirname, 'implementations');
    const files = fs.readdirSync(implementationsPath);
    return files
      .filter((f) => f.endsWith('.js'))
      .map((file) => {
        const QueueClass = require(path.join(implementationsPath, file));
        return new QueueClass();
      });
  }

  initialize() {
    this.instances.forEach((queue) => {
      queue.initialize(QueueService);
    });
  }

  getQueues() {
    const map = {};
    this.instances.forEach((queue) => {
      if (queue.name && queue.queue) {
        map[queue.name] = queue.queue;
      }
    });
    return map;
  }
}

module.exports = QueueManager;
