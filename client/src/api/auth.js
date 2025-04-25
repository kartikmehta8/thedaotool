import toast from '../utils/toast';
import { API_URL } from '../constants/constants';

export const loginUser = async (email, password, navigate) => {
  try {
    const res = await fetch(API_URL + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    localStorage.setItem('payman-user', JSON.stringify(data.user));
    toast.success('Logged in successfully');
    navigate('/dashboard');
  } catch (err) {
    toast.error(err.message || 'Login failed');
  }
};

export const signupUser = async (email, password, role, navigate) => {
  try {
    const res = await fetch(API_URL + '/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    localStorage.setItem('payman-user', JSON.stringify(data.user));
    toast.success('Account created successfully');
    navigate('/dashboard');
  } catch (err) {
    toast.error(err.message || 'Signup failed');
  }
};
