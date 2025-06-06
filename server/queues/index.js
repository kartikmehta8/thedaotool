const QueueManager = require('./QueueManager');

const manager = new QueueManager();
manager.initialize();

module.exports = manager.getQueues();
