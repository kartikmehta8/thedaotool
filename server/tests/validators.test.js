const { loginSchema, signupSchema, emailSchema, verifyTokenSchema, resetPasswordSchema } = require('../validators/authValidators');
const orgVal = require('../validators/organizationValidators');
const contribVal = require('../validators/contributorValidators');
const discordVal = require('../validators/discordValidators');
const githubVal = require('../validators/githubValidators');
const walletVal = require('../validators/walletValidators');

describe('Validator Schemas', () => {
  test('auth login schema', () => {
    expect(loginSchema.validate({ email: 'a@b.com', password: 'password123' }).error).toBeUndefined();
    expect(loginSchema.validate({ email: 'a@b.com' }).error).toBeTruthy();
  });

  test('auth signup schema', () => {
    expect(signupSchema.validate({ email: 'a@b.com', password: 'password123', role: 'contributor' }).error).toBeUndefined();
    expect(signupSchema.validate({ email: 'a@b.com', password: 'pass' }).error).toBeTruthy();
  });

  test('organization create bounty schema', () => {
    const valid = { body: { values: { name: 'Bug', description: 'Fix bug in code', deadline: new Date(), amount: 1 }, userId: 'u1' } };
    expect(orgVal.createBountySchema.body.validate(valid.body).error).toBeUndefined();
    expect(orgVal.createBountySchema.body.validate({}).error).toBeTruthy();
  });

  test('contributor apply schema', () => {
    expect(contribVal.applyToBountySchema.body.validate({ bountyId: 'b1' }).error).toBeUndefined();
    expect(contribVal.applyToBountySchema.body.validate({}).error).toBeTruthy();
  });

  test('discord oauth schema', () => {
    expect(discordVal.initiateOAuthSchema.query.validate({ userId: 'u1' }).error).toBeUndefined();
    expect(discordVal.initiateOAuthSchema.query.validate({}).error).toBeTruthy();
  });

  test('github save repo schema', () => {
    expect(githubVal.saveRepoSchema.body.validate({ repo: 'owner/repo' }).error).toBeUndefined();
    expect(githubVal.saveRepoSchema.body.validate({}).error).toBeTruthy();
  });

  test('wallet send schema', () => {
    expect(walletVal.sendSchema.body.validate({ toAddress: 'addr', amount: 1 }).error).toBeUndefined();
    expect(walletVal.sendSchema.body.validate({ toAddress: 'addr' }).error).toBeTruthy();
  });
});
