const FirestoreService = require('./FirestoreService');
const jwt = require('jsonwebtoken');
const LoginThrottleService = require('./LoginThrottleService');

const MAX_ATTEMPTS = Number(process.env.MAX_LOGIN_ATTEMPTS || 3);

class UserService {
  async login(email, password) {
    const hasReachedLimit = await this.hasReachedMaxRetries(email);
    if (hasReachedLimit) {
      throw new Error('Too many login attempts. Try again later.');
    }

    try {
      const userCredential = await this.verifyLogin(email, password);
      const userData = await this.getUserData(userCredential.user.uid);

      await LoginThrottleService.reset(email);

      return this.buildUserProfile(userCredential, userData);
    } catch (err) {
      await LoginThrottleService.increment(email);
      throw err;
    }
  }

  async signup(email, password, role) {
    const result = await FirestoreService.signup(email, password);
    await FirestoreService.setDocument('users', result.user.uid, {
      email,
      role,
    });
    return this.buildUserProfile(result, { role });
  }

  generateToken(user) {
    return jwt.sign(
      {
        uid: user.uid,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '12h' }
    );
  }

  async verifyLogin(email, password) {
    return FirestoreService.login(email, password);
  }

  async getUserData(uid) {
    const data = await FirestoreService.getDocument('users', uid);
    if (!data) throw new Error('User profile not found');
    return data;
  }

  buildUserProfile(userCredential, userData) {
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      role: userData.role,
    };
  }

  async hasReachedMaxRetries(email) {
    const status = await LoginThrottleService.getStatus(email);
    return status?.count >= MAX_ATTEMPTS;
  }
}

module.exports = new UserService();
