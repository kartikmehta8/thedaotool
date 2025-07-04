const jwt = require('jsonwebtoken');
const CacheService = require('../services/misc/CacheService');
const UserService = require('../services/user/UserService');
const AuthMiddleware = require('../middlewares/implementations/auth/AuthMiddleware');
const EmailVerifiedMiddleware = require('../middlewares/implementations/auth/EmailVerifiedMiddleware');
const OwnershipMiddleware = require('../middlewares/implementations/auth/OwnershipMiddleware');
const CacheMiddleware = require('../middlewares/implementations/cache/CacheMiddleware');
const ValidationMiddleware = require('../middlewares/implementations/validation/ValidationMiddleware');

jest.mock('jsonwebtoken');
jest.mock('../services/misc/CacheService');
jest.mock('../services/user/UserService');

function mockRes() {
  return { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
}

describe('AuthMiddleware', () => {
  test('missing header unauthorized', () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();
    AuthMiddleware.authenticate()(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('valid token passes', () => {
    jwt.verify.mockReturnValue({ uid: '1', role: 'contributor' });
    const req = { headers: { authorization: 'Bearer tok' } };
    const res = mockRes();
    const next = jest.fn();
    AuthMiddleware.authenticate(['contributor'])(req, res, next);
    expect(req.user.uid).toBe('1');
    expect(next).toHaveBeenCalled();
  });
});

describe('EmailVerifiedMiddleware', () => {
  test('forbids when not verified', async () => {
    UserService.getUserData.mockResolvedValue({ emailVerified: false });
    const req = { user: { uid: '1' } };
    const res = mockRes();
    const next = jest.fn();
    await EmailVerifiedMiddleware.requireVerified(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('allows verified users', async () => {
    UserService.getUserData.mockResolvedValue({ emailVerified: true });
    const req = { user: { uid: '1' } };
    const res = mockRes();
    const next = jest.fn();
    await EmailVerifiedMiddleware.requireVerified(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});

describe('OwnershipMiddleware', () => {
  test('blocks mismatched uid', () => {
    const req = { user: { uid: '1' }, params: { uid: '2' } };
    const res = mockRes();
    const next = jest.fn();
    OwnershipMiddleware.verifyParamUid('uid')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});

describe('CacheMiddleware', () => {
  test('returns cached response', async () => {
    CacheService.get.mockResolvedValue({ ok: true });
    const req = { method: 'GET', originalUrl: '/a' };
    const res = mockRes();
    const next = jest.fn();
    await CacheMiddleware.use(300)(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
    expect(next).not.toHaveBeenCalled();
  });

  test('stores data when responding', async () => {
    CacheService.get.mockResolvedValue(null);
    const req = { method: 'GET', originalUrl: '/b' };
    const res = mockRes();
    const next = jest.fn();
    await CacheMiddleware.use(300)(req, res, next);
    await res.json({ foo: 'bar' });
    expect(CacheService.set).toHaveBeenCalledWith('GET:/b', { foo: 'bar' }, 300);
  });
});

describe('ValidationMiddleware', () => {
  test('fails validation', () => {
    const schema = { body: { validate: () => ({ error: { details: [{ message: 'bad' }] }, value: {} }) } };
    const req = { body: {} };
    const res = mockRes();
    const next = jest.fn();
    ValidationMiddleware.use(schema)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('passes validation', () => {
    const schema = { body: { validate: () => ({ value: { a: 1 } }) } };
    const req = { body: {} };
    const res = mockRes();
    const next = jest.fn();
    ValidationMiddleware.use(schema)(req, res, next);
    expect(req.body.a).toBe(1);
    expect(next).toHaveBeenCalled();
  });
});
