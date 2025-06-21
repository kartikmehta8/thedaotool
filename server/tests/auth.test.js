const request = require('supertest');
const express = require('express');
require('module-alias/register');
const jwt = require('jsonwebtoken');

const AuthRoutes = require('../routes/implementations/AuthRoutes');
const UserService = require('../services/user/UserService');

jest.mock('../services/user/UserService');

describe('Auth Routes', () => {
  let app;

  beforeAll(() => {
    process.env.JWT_SECRET = 'testsecret';
    app = express();
    app.use(express.json());
    new AuthRoutes().register(app);
  });

  test('POST /api/auth/login returns token', async () => {
    UserService.login.mockResolvedValue({
      uid: '1',
      email: 'test@example.com',
      role: 'organization',
      walletAddress: 'addr',
      emailVerified: true
    });
    UserService.generateToken.mockReturnValue('token123');

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe('token123');
    expect(UserService.login).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  test('POST /api/auth/signup creates user', async () => {
    UserService.signup.mockResolvedValue({ uid: '2', email: 'new@example.com', role: 'contributor' });
    UserService.generateToken.mockReturnValue('newtoken');

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'new@example.com', password: 'password123', role: 'contributor' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBe('newtoken');
    expect(UserService.signup).toHaveBeenCalledWith('new@example.com', 'password123', 'contributor');
  });

  test('POST /api/auth/forgot-password sends reset otp', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'user@example.com' });

    expect(res.status).toBe(200);
    expect(UserService.sendOTP).toHaveBeenCalledWith('user@example.com', 'passwordReset');
  });

  test('POST /api/auth/verify-email sends verification otp', async () => {
    const res = await request(app)
      .post('/api/auth/verify-email')
      .send({ email: 'user@example.com' });

    expect(res.status).toBe(200);
    expect(UserService.sendOTP).toHaveBeenCalledWith('user@example.com', 'emailVerification');
  });

  test('POST /api/auth/verify-token verifies token', async () => {
    UserService.verifyOTP.mockResolvedValue(true);

    const res = await request(app)
      .post('/api/auth/verify-token')
      .send({ email: 'user@example.com', token: '1234' });

    expect(res.status).toBe(200);
    expect(res.body.verified).toBe(true);
    expect(UserService.verifyOTP).toHaveBeenCalledWith('user@example.com', '1234');
  });

  test('POST /api/auth/reset-password resets password', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ email: 'user@example.com', token: '1234', newPassword: 'newpass123' });

    expect(res.status).toBe(200);
    expect(UserService.resetPassword).toHaveBeenCalledWith('user@example.com', '1234', 'newpass123');
  });
});
