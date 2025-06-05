const FirestoreService = require('@services/database/FirestoreService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const LoginThrottleService = require('@services/misc/LoginThrottleService');
const OTPService = require('@services/misc/OTPTokenService');
const EmailService = require('@services/misc/EmailService');

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
    if (existingUser) throw new Error('Email already in use');

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const userDoc = await FirestoreService.addDocument('users', {
      email,
      role,
      passwordHash,
      emailVerified: false,
      createdAt: new Date().toISOString(),
    });

    return {
      uid: userDoc.id,
      email,
      emailVerified: false,
      role,
    };
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
      emailVerified: user.emailVerified || false,
      role: user.role,
    };
  }

  async hasReachedMaxRetries(email) {
    const status = await LoginThrottleService.getStatus(email);
    return status?.count >= MAX_ATTEMPTS;
  }

  async sendOTP(email, type) {
    const user = await this.findUserByEmail(email);
    if (!user) throw new Error('Email not registered');

    const token = await OTPService.generateOTP(user.uid || user.id, type);

    if (type === 'passwordReset') {
      await EmailService.sendForgotPasswordEmail({ to: email, token });
    } else if (type === 'emailVerification') {
      await EmailService.sendVerificationEmail({ to: email, token });
    }

    return true;
  }

  async verifyOTP(email, token) {
    const user = await this.findUserByEmail(email);
    if (!user) throw new Error('User not found');

    const isValid = await OTPService.validateOTP(
      user.uid || user.id,
      token,
      'emailVerification'
    );
    if (!isValid) throw new Error('Invalid or expired token');

    await FirestoreService.updateDocument('users', user.uid || user.id, {
      emailVerified: true,
    });

    await OTPService.deleteOTP(user.uid || user.id, token, 'emailVerification');
    return true;
  }

  async resetPassword(email, token, newPassword) {
    const user = await this.findUserByEmail(email);
    if (!user) throw new Error('User not found');

    const isValid = await OTPService.validateOTP(
      user.uid || user.id,
      token,
      'passwordReset'
    );
    if (!isValid) throw new Error('Invalid or expired token');

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await FirestoreService.updateDocument('users', user.uid || user.id, {
      passwordHash,
    });

    await OTPService.deleteOTP(user.uid || user.id, token, 'passwordReset');
    return true;
  }
}

module.exports = new UserService();
