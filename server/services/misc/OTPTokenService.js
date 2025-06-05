const crypto = require('crypto');
const FirestoreService = require('@services/database/FirestoreService');

const OTP_COLLECTION = 'otp_tokens';
const OTP_EXPIRY_MINUTES = 15;

class OTPTokenService {
  async generateOTP(userId, type) {
    const token = crypto.randomBytes(20).toString('hex');
    const expiresAt = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;

    await FirestoreService.addDocument(OTP_COLLECTION, {
      userId,
      token,
      type,
      expiresAt,
    });

    return token;
  }

  async validateOTP(userId, token, type) {
    const results = await FirestoreService.queryDocuments(
      OTP_COLLECTION,
      'userId',
      '==',
      userId
    );

    const record = results.find(
      (entry) =>
        entry.token === token &&
        entry.type === type &&
        entry.expiresAt > Date.now()
    );

    return record || null;
  }

  async deleteOTP(userId, token, type) {
    const results = await FirestoreService.queryDocuments(
      OTP_COLLECTION,
      'userId',
      '==',
      userId
    );

    const match = results.find(
      (entry) => entry.token === token && entry.type === type
    );

    if (match) {
      await FirestoreService.deleteDocument(OTP_COLLECTION, match.id);
    }
  }

  async clearExpiredOTPs() {
    const allTokens = await FirestoreService.getCollection(OTP_COLLECTION);
    const now = Date.now();

    for (const token of allTokens) {
      if (token.expiresAt <= now) {
        await FirestoreService.deleteDocument(OTP_COLLECTION, token.id);
      }
    }
  }
}

module.exports = new OTPTokenService();
