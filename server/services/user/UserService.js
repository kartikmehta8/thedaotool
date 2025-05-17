const FirestoreService = require('../database/FirestoreService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const LoginThrottleService = require('../misc/LoginThrottleService');

const MAX_ATTEMPTS = Number(process.env.MAX_LOGIN_ATTEMPTS || 3);
const SALT_ROUNDS = 10;

class UserService {
  async login(email, password) {
    const hasReachedLimit = await this.hasReachedMaxRetries(email);
    if (hasReachedLimit) {
      throw new Error('Too many login attempts. Try again later.');
    }

    try {
      const user = await this.findUserByEmail(email);
      if (!user) throw new Error('User not found');

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) throw new Error('Invalid email or password');

      await LoginThrottleService.reset(email);

      return this.buildUserProfile(user);
    } catch (err) {
      await LoginThrottleService.increment(email);
      throw err;
    }
  }

  async signup(email, password, role) {
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const userDoc = await FirestoreService.addDocument('users', {
      email,
      role,
      passwordHash,
      createdAt: new Date().toISOString(),
    });

    const user = {
      uid: userDoc.id,
      email,
      role,
    };

    return user;
  }

  async findUserByEmail(email) {
    const result = await FirestoreService.queryDocuments(
      'users',
      'email',
      '==',
      email
    );
    return result[0] || null;
  }

  async getUserData(uid) {
    const data = await FirestoreService.getDocument('users', uid);
    if (!data) throw new Error('User profile not found');
    return data;
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

  buildUserProfile(user) {
    return {
      uid: user.uid || user.id,
      email: user.email,
      role: user.role,
    };
  }

  async hasReachedMaxRetries(email) {
    const status = await LoginThrottleService.getStatus(email);
    return status?.count >= MAX_ATTEMPTS;
  }
}

module.exports = new UserService();
