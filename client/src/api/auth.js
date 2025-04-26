import { API_URL } from '../constants/constants';

export const loginUser = async (email, password) => {
  const res = await fetch(API_URL + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data.user;
};

export const signupUser = async (email, password, role) => {
  const res = await fetch(API_URL + '/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Signup failed');
  }

  return data.user;
};
