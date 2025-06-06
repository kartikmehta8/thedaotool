module.exports = {
  githubSyncQueue: require('./githubSyncWorker'),
  otpCleanupQueue: require('./otpCleanupWorker'),
  emailQueue: require('./emailWorker'),
};
