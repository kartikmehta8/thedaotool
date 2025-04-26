const FirestoreService = require('../services/FirestoreService');

class AuthController {
  async loginUser(req, res) {
    const { email, password } = req.body;

    try {
      const result = await FirestoreService.login(email, password);
      const userData = await FirestoreService.getDocument(
        'users',
        result.user.uid
      );

      if (!userData) {
        return res
          .status(404)
          .json({ message: 'User profile not found in database.' });
      }

      const userProfile = {
        uid: result.user.uid,
        email: result.user.email,
        role: userData.role,
      };

      return res
        .status(200)
        .json({ message: 'Login successful', user: userProfile });
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  }

  async signupUser(req, res) {
    const { email, password, role } = req.body;

    try {
      const result = await FirestoreService.signup(email, password);
      await FirestoreService.setDocument('users', result.user.uid, {
        email,
        role,
      });

      const userProfile = {
        uid: result.user.uid,
        email,
        role,
      };

      return res
        .status(201)
        .json({ message: 'Signup successful', user: userProfile });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Signup failed' });
    }
  }
}

module.exports = new AuthController();
