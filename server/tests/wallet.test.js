const request = require('supertest');
const express = require('express');
require('module-alias/register');
const jwt = require('jsonwebtoken');

const WalletRoutes = require('../routes/implementations/WalletRoutes');
const WalletService = require('../services/user/WalletService');

jest.mock('../services/user/WalletService');

describe('Wallet Routes', () => {
  let app;
  let token;

  beforeAll(() => {
    process.env.JWT_SECRET = 'testsecret';
    token = jwt.sign({ uid: 'user1', role: 'organization' }, process.env.JWT_SECRET);
    app = express();
    app.use(express.json());
    new WalletRoutes().register(app);
  });

  test('GET /api/wallet/balance returns balance', async () => {
    WalletService.getBalance.mockResolvedValue(10);

    const res = await request(app)
      .get('/api/wallet/balance')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.balance).toBe(10);
    expect(WalletService.getBalance).toHaveBeenCalledWith('user1');
  });

  test('POST /api/wallet/send sends transaction', async () => {
    WalletService.send.mockResolvedValue('hash');

    const res = await request(app)
      .post('/api/wallet/send')
      .set('Authorization', `Bearer ${token}`)
      .send({ toAddress: 'addr', amount: 1 });

    expect(res.status).toBe(200);
    expect(res.body.txHash).toBe('hash');
    expect(WalletService.send).toHaveBeenCalledWith('user1', 'addr', 1);
  });
});
