const jwt = require('jsonwebtoken');
const FirestoreService = require('../services/database/FirestoreService');
const CacheService = require('../services/misc/CacheService');
const EmailService = require('../services/misc/EmailService');
const ContributorService = require('../services/user/ContributorService');
const UserService = require('../services/user/UserService');
const WalletService = require('../services/user/WalletService');
const PrivyService = require('../services/integrations/PrivyService');

jest.mock('../services/database/FirestoreService');
jest.mock('../services/misc/CacheService');
jest.mock('../services/misc/EmailService');

beforeAll(() => {
  process.env.JWT_SECRET = 'secret';
});

describe('UserService', () => {
  test('generateToken and buildUserProfile', () => {
    const user = { uid: 'u1', email: 'a@b.com', role: 'contributor', walletAddress: 'addr' };
    const token = UserService.generateToken(user);
    const decoded = jwt.verify(token, 'secret');
    expect(decoded.uid).toBe('u1');
    const profile = UserService.buildUserProfile(user);
    expect(profile.email).toBe('a@b.com');
  });
});

describe('ContributorService.applyToBounty', () => {
  beforeEach(() => jest.clearAllMocks());

  test('updates bounty and sends email', async () => {
    FirestoreService.getDocument.mockResolvedValue({ status: 'open' });
    FirestoreService.updateDocument.mockResolvedValue();
    await ContributorService.applyToBounty('b1', 'u1');
    expect(FirestoreService.updateDocument).toHaveBeenCalled();
    expect(CacheService.del).toHaveBeenCalled();
    expect(EmailService.sendBountyAssignedToOrganization).toHaveBeenCalled();
  });
});

describe('WalletService.getBalance', () => {
  test('returns SOL balance', async () => {
    FirestoreService.getDocument.mockResolvedValue({ walletAddress: 'addr' });
    PrivyService.connection.getBalance = jest.fn().mockResolvedValue(1e9);
    const bal = await WalletService.getBalance('u1');
    expect(bal).toBe(1);
  });
});
