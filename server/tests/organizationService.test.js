const OrganizationService = require('../services/user/OrganizationService');
const FirestoreService = require('../services/database/FirestoreService');
const PrivyService = require('../services/integrations/PrivyService');
const CacheService = require('../services/misc/CacheService');
const EmailService = require('../services/misc/EmailService');

jest.mock('../services/database/FirestoreService');
jest.mock('../services/integrations/PrivyService');
jest.mock('../services/misc/CacheService');
jest.mock('../services/misc/EmailService');

describe('OrganizationService.payBounty', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('throws if bounty not found', async () => {
    FirestoreService.getDocument.mockResolvedValueOnce(null);
    await expect(OrganizationService.payBounty('b1', 'org1')).rejects.toThrow('Bounty not found');
  });

  test('processes payment', async () => {
    FirestoreService.getDocument
      .mockResolvedValueOnce({ organizationId: 'org1', contributorId: 'c1', status: 'pending_payment', amount: 1 })
      .mockResolvedValueOnce({ walletId: 'w1', walletAddress: 'orgAddr' })
      .mockResolvedValueOnce({ walletAddress: 'contribAddr' });
    PrivyService.sendSol.mockResolvedValue('tx');
    FirestoreService.updateDocument.mockResolvedValue();
    const tx = await OrganizationService.payBounty('b1', 'org1');
    expect(tx).toBe('tx');
    expect(PrivyService.sendSol).toHaveBeenCalledWith('w1', 'orgAddr', 'contribAddr', Math.round(1e9));
  });
});
