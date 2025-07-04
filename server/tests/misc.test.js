const RealtimeDatabaseService = require('../services/database/RealtimeDatabaseService');
const FirestoreService = require('../services/database/FirestoreService');
const EncryptionService = require('../services/misc/EncryptionService');
const LoginThrottleService = require('../services/misc/LoginThrottleService');
const OTPTokenService = require('../services/misc/OTPTokenService');

jest.mock('../services/database/RealtimeDatabaseService');
jest.mock('../services/database/FirestoreService');

describe('EncryptionService', () => {
  test('encrypt and decrypt', () => {
    const text = 'secret';
    const enc = EncryptionService.encrypt(text);
    const dec = EncryptionService.decrypt(enc);
    expect(dec).toBe(text);
  });
});

describe('LoginThrottleService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getUserKey encodes email', () => {
    const key = LoginThrottleService.getUserKey('a@b.com');
    expect(key).toBe('loginAttempts/' + Buffer.from('a@b.com').toString('base64'));
  });

  test('increment sets count', async () => {
    RealtimeDatabaseService.getData.mockResolvedValue(null);
    await LoginThrottleService.increment('a@b.com');
    expect(RealtimeDatabaseService.setData).toHaveBeenCalled();
  });

  test('reset removes data', async () => {
    await LoginThrottleService.reset('a@b.com');
    expect(RealtimeDatabaseService.removeData).toHaveBeenCalled();
  });
});

describe('OTPTokenService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('generateOTP stores token', async () => {
    FirestoreService.addDocument.mockResolvedValue();
    const token = await OTPTokenService.generateOTP('u1', 'emailVerification');
    expect(token).toBeDefined();
    expect(FirestoreService.addDocument).toHaveBeenCalled();
  });

  test('validateOTP finds token', async () => {
    const now = Date.now() + 1000;
    FirestoreService.queryDocuments.mockResolvedValue([{ token: 't1', type: 'emailVerification', expiresAt: now }]);
    const res = await OTPTokenService.validateOTP('u1', 't1', 'emailVerification');
    expect(res).toBeTruthy();
  });
});
