const Queue = require('bull');
const QueueService = require('../queues/QueueService');
const EmailQueue = require('../queues/implementations/EmailQueue');
const GitHubSyncQueue = require('../queues/implementations/GitHubSyncQueue');
const OTPTokenCleanupQueue = require('../queues/implementations/OTPTokenCleanupQueue');
const syncGitHubIssues = require('../cron/functions/syncGitHubIssues');
const OTPTokenService = require('../services/misc/OTPTokenService');
const sendMail = require('../utils/mailer');

jest.mock('bull', () => jest.fn(() => ({ add: jest.fn(), process: jest.fn(), on: jest.fn() })));
jest.mock('../cron/functions/syncGitHubIssues');
jest.mock('../services/misc/OTPTokenService');
jest.mock('../utils/mailer');

describe('QueueService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getQueue caches instance', () => {
    const q1 = QueueService.getQueue('a');
    const q2 = QueueService.getQueue('a');
    expect(Queue).toHaveBeenCalledTimes(1);
    expect(q1).toBe(q2);
  });

  test('add delegates to queue', async () => {
    const q = QueueService.getQueue('b');
    await QueueService.add('b', { foo: 1 });
    expect(q.add).toHaveBeenCalledWith('b', { foo: 1 });
  });

  test('process registers handler', () => {
    const q = QueueService.getQueue('c');
    const handler = jest.fn();
    QueueService.process('c', handler, 2);
    expect(q.process).toHaveBeenCalled();
    const args = q.process.mock.calls[0];
    expect(args[0]).toBe('c');
    expect(args[1]).toBe(2);
  });
});

describe('Queue implementations', () => {
  test('EmailQueue initialize', async () => {
    const service = {
      getQueue: jest.fn(() => ({ add: jest.fn(), process: jest.fn(), on: jest.fn() })),
      process: jest.fn()
    };
    const queue = new EmailQueue();
    queue.initialize(service);
    expect(service.getQueue).toHaveBeenCalledWith('email');
    const cb = service.process.mock.calls[0][1];
    await cb({});
    expect(sendMail).toHaveBeenCalled();
  });

  test('GitHubSyncQueue initialize', async () => {
    const service = {
      getQueue: jest.fn(() => ({ add: jest.fn(), process: jest.fn(), on: jest.fn() })),
      process: jest.fn()
    };
    const queue = new GitHubSyncQueue();
    queue.initialize(service);
    expect(service.getQueue).toHaveBeenCalledWith('githubSync');
    const cb = service.process.mock.calls[0][1];
    await cb();
    expect(syncGitHubIssues).toHaveBeenCalled();
  });

  test('OTPTokenCleanupQueue initialize', async () => {
    const service = {
      getQueue: jest.fn(() => ({ add: jest.fn(), process: jest.fn(), on: jest.fn() })),
      process: jest.fn()
    };
    const queue = new OTPTokenCleanupQueue();
    queue.initialize(service);
    expect(service.getQueue).toHaveBeenCalledWith('otpCleanup');
    const cb = service.process.mock.calls[0][1];
    await cb();
    expect(OTPTokenService.clearExpiredOTPs).toHaveBeenCalled();
  });
});
