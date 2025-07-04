const { auth, db, rtdb } = require('../utils/firebase');
const EncryptionService = require('../services/misc/EncryptionService');

jest.mock('../utils/firebase', () => {
  const doc = { get: jest.fn(), set: jest.fn(), update: jest.fn(), delete: jest.fn() };
  const collection = { doc: jest.fn(() => doc), add: jest.fn() };
  const db = { collection: jest.fn(() => collection) };
  const ref = { set: jest.fn(), update: jest.fn(), remove: jest.fn(), once: jest.fn() };
  const rtdb = { ref: jest.fn(() => ref) };
  const auth = { verifyIdToken: jest.fn(), getUserByEmail: jest.fn(), createUser: jest.fn(), deleteUser: jest.fn() };
  return { auth, db, rtdb, __doc: doc, __collection: collection, __ref: ref };
});

jest.mock('../services/misc/EncryptionService', () => ({
  encrypt: jest.fn((v) => `enc-${v}`),
  decrypt: jest.fn((v) => v.replace('enc-', ''))
}));

const FirestoreService = require('../services/database/FirestoreService');
const RealtimeDatabaseService = require('../services/database/RealtimeDatabaseService');

describe('FirestoreService', () => {
  const { __doc, __collection } = require('../utils/firebase');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('setDocument encrypts data', async () => {
    await FirestoreService.setDocument('coll', '1', { discordAccessToken: 'tok', foo: 'bar' });
    expect(db.collection).toHaveBeenCalledWith('coll');
    expect(__collection.doc).toHaveBeenCalledWith('1');
    expect(EncryptionService.encrypt).toHaveBeenCalledWith('tok');
    expect(__doc.set).toHaveBeenCalledWith({ discordAccessToken: 'enc-tok', foo: 'bar' }, { merge: false });
  });

  test('getDocument decrypts data', async () => {
    __doc.get.mockResolvedValue({ exists: true, data: () => ({ githubToken: 'enc-secret' }) });
    const data = await FirestoreService.getDocument('coll', '2');
    expect(__collection.doc).toHaveBeenCalledWith('2');
    expect(EncryptionService.decrypt).toHaveBeenCalledWith('enc-secret');
    expect(data.githubToken).toBe('secret');
  });
});

describe('RealtimeDatabaseService', () => {
  const { __ref } = require('../utils/firebase');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('setData writes to path', async () => {
    await RealtimeDatabaseService.setData('path', { a: 1 });
    expect(rtdb.ref).toHaveBeenCalledWith('path');
    expect(__ref.set).toHaveBeenCalledWith({ a: 1 });
  });

  test('getData reads from path', async () => {
    __ref.once.mockResolvedValue({ exists: () => true, val: () => 5 });
    const val = await RealtimeDatabaseService.getData('path');
    expect(val).toBe(5);
  });
});
