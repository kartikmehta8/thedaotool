const cron = require('node-cron');
const queues = require('../queues');
const RealtimeDatabaseService = require('../services/database/RealtimeDatabaseService');
const CronManager = require('../cron/CronManager');
const GitHubSyncJob = require('../cron/implementations/GitHubSyncJob');
const LoginAttemptCleanupJob = require('../cron/implementations/LoginAttemptCleanupJob');
const OTPTokenCleanupJob = require('../cron/implementations/OTPTokenCleanupJob');

jest.mock('node-cron', () => ({ schedule: jest.fn((_, fn) => fn()) }));
jest.mock('../queues', () => ({
  githubSyncQueue: { add: jest.fn() },
  otpCleanupQueue: { add: jest.fn() }
}));
jest.mock('../services/database/RealtimeDatabaseService');

describe('Cron jobs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('CronManager schedules all jobs', () => {
    const manager = new CronManager();
    manager.jobs = [{ schedule: jest.fn() }, { schedule: jest.fn() }];
    manager.scheduleJobs();
    expect(manager.jobs[0].schedule).toHaveBeenCalled();
    expect(manager.jobs[1].schedule).toHaveBeenCalled();
  });

  test('GitHubSyncJob schedules queue add', async () => {
    const job = new GitHubSyncJob();
    await job.schedule();
    expect(queues.githubSyncQueue.add).toHaveBeenCalledWith('githubSync', {});
  });

  test('LoginAttemptCleanupJob schedules rtdb cleanup', async () => {
    const job = new LoginAttemptCleanupJob();
    await job.schedule();
    expect(RealtimeDatabaseService.removeData).toHaveBeenCalledWith('loginAttempts');
  });

  test('OTPTokenCleanupJob schedules queue add', async () => {
    const job = new OTPTokenCleanupJob();
    await job.schedule();
    expect(queues.otpCleanupQueue.add).toHaveBeenCalledWith('otpCleanup', {});
  });
});
