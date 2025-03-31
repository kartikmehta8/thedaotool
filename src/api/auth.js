import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../providers/firebase';
import toast from '../utils/toast';

export const loginUser = async (email, password, navigate) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);

    const userRef = doc(db, 'users', result.user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userProfile = {
        uid: result.user.uid,
        email: result.user.email,
        role: userSnap.data().role, // add more fields as needed.
      };

      localStorage.setItem('payman-user', JSON.stringify(userProfile));

      toast.success('Logged in successfully');
      navigate('/dashboard');
    } else {
      toast.error('User profile not found in database.');
    }
  } catch (err) {
    toast.error('Something went wrong during login');
  }
};

export const signupUser = async (email, password, role, navigate) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, 'users', result.user.uid);

    await setDoc(userRef, { email, role });

    localStorage.setItem(
      'payman-user',
      JSON.stringify({ uid: result.user.uid, email, role })
    );

    toast.success('Account created successfully');
    navigate('/dashboard');
  } catch (err) {
    toast.error('Something went wrong during signup');
  }
};
