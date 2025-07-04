const EmailService = require('../services/misc/EmailService');
const FirestoreService = require('../services/database/FirestoreService');
const { emailQueue } = require('../queues');

jest.mock('../services/database/FirestoreService');
jest.mock('../queues', () => ({ emailQueue: { add: jest.fn() } }));

describe('EmailService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('sendVerificationEmail enqueues email', async () => {
    await EmailService.sendVerificationEmail({ to: 'a@b.com', token: '123' });
    expect(emailQueue.add).toHaveBeenCalled();
  });

  test('sendBountyAssignedToOrganization sends notification', async () => {
    FirestoreService.getDocument.mockImplementation((c) => {
      if (c === 'bounties') return Promise.resolve({ name: 'B', organizationId: 'o1', contributorId: 'c1' });
      if (c === 'contributors') return Promise.resolve({ name: 'Alice', email: 'alice@a.com' });
      if (c === 'organizations') return Promise.resolve({ email: 'org@a.com' });
    });
    await EmailService.sendBountyAssignedToOrganization({ bountyId: 'b1' });
    expect(emailQueue.add).toHaveBeenCalled();
  });
});
