const {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} = require('firebase/auth');
const { doc, getDoc, setDoc } = require('firebase/firestore');
const { auth, db } = require('../utils/firebase');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);

    const userRef = doc(db, 'users', result.user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return res
        .status(404)
        .json({ message: 'User profile not found in database.' });
    }

    const userProfile = {
      uid: result.user.uid,
      email: result.user.email,
      role: userSnap.data().role,
    };

    return res
      .status(200)
      .json({ message: 'Login successful', user: userProfile });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid credentials' });
  }
};

const signupUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, 'users', result.user.uid);

    await setDoc(userRef, { email, role });

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
};

module.exports = {
  loginUser,
  signupUser,
};
