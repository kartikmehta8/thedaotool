const FirestoreService = require('./FirestoreService');
const jwt = require('jsonwebtoken');

class UserService {
  async login(email, password) {
    const result = await FirestoreService.login(email, password);
    const userData = await FirestoreService.getDocument(
      'users',
      result.user.uid
    );

    if (!userData) {
      throw new Error('User profile not found');
    }

    return {
      uid: result.user.uid,
      email: result.user.email,
      role: userData.role,
    };
  }

  async signup(email, password, role) {
    const result = await FirestoreService.signup(email, password);
    await FirestoreService.setDocument('users', result.user.uid, {
      email,
      role,
    });

    return {
      uid: result.user.uid,
      email,
      role,
    };
  }

  generateToken(user) {
    return jwt.sign(
      {
        uid: user.uid,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }
}

module.exports = new UserService();
