const FirestoreService = require('./FirestoreService');

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
}

module.exports = new UserService();
