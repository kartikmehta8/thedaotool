const RealtimeDatabaseService = require('./RealtimeDatabaseService');

class LoginThrottleService {
  getUserKey(email) {
    return `loginAttempts/${Buffer.from(email).toString('base64')}`;
  }

  async getStatus(email) {
    return await RealtimeDatabaseService.getData(this.getUserKey(email));
  }

  async increment(email) {
    const path = this.getUserKey(email);
    const now = Date.now();
    const current = await RealtimeDatabaseService.getData(path);
    const failedAttempts = current?.count || 0;

    await RealtimeDatabaseService.setData(path, {
      count: failedAttempts + 1,
      createdAt: now,
    });
  }

  async reset(email) {
    await RealtimeDatabaseService.removeData(this.getUserKey(email));
  }
}

module.exports = new LoginThrottleService();
